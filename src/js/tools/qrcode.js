import { buildQrPayload, normalizeWebUrl } from './qrcode-data.js';

const form = document.getElementById('qr-form');
const preview = document.getElementById('qr-preview');
const status = document.getElementById('qr-status');
const readyIndicator = document.getElementById('ready-indicator');
const audioPreview = document.getElementById('audio-preview');
const logoInput = document.getElementById('logo-file');
const logoPreview = document.getElementById('logo-preview');
const removeLogoButton = document.getElementById('remove-logo');
const styleStorageKey = 'sheekovic-qr-style-v1';
const typeNames = { url: 'Link', text: 'Text', contact: 'Contact', audio: 'Audio', wifi: 'Wi-Fi' };
const styleFields = [
  'primaryColor', 'secondaryColor', 'backgroundColor', 'gradient', 'dotStyle',
  'cornerStyle', 'gradientRotation', 'errorLevel', 'size', 'margin', 'logoSize',
  'logoMargin',
];
const presets = {
  classic: { primaryColor: '#111827', secondaryColor: '#111827', backgroundColor: '#ffffff', gradient: false },
  ocean: { primaryColor: '#0f3d91', secondaryColor: '#06b6d4', backgroundColor: '#f7fcff', gradient: true },
  sunset: { primaryColor: '#7c2d12', secondaryColor: '#f97316', backgroundColor: '#fffaf5', gradient: true },
  mint: { primaryColor: '#07111f', secondaryColor: '#087f61', backgroundColor: '#ffffff', gradient: true },
};
const allowedLogoTypes = new Set(['image/png', 'image/jpeg', 'image/webp']);

let logoDataUrl = '';
let qrCode;
let latestPayload = '';
let renderTimer;

function control(name) {
  return form.elements.namedItem(name);
}

function value(name) {
  return control(name)?.value?.trim() || '';
}

function selectedType() {
  return value('content-type');
}

function currentFields() {
  return {
    url: value('url'),
    text: value('text'),
    name: value('name'),
    organization: value('organization'),
    jobTitle: value('jobTitle'),
    phone: value('phone'),
    email: value('email'),
    website: value('website'),
    address: value('address'),
    note: value('note'),
    audioUrl: value('audioUrl'),
    ssid: value('ssid'),
    security: value('security'),
    password: value('password'),
    hidden: control('hidden').checked,
  };
}

function contrastRatio(first, second) {
  const luminance = (hex) => {
    const channels = hex.match(/[a-f\d]{2}/gi).map((channel) => {
      const normalized = Number.parseInt(channel, 16) / 255;
      return normalized <= 0.03928
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const light = Math.max(luminance(first), luminance(second));
  const dark = Math.min(luminance(first), luminance(second));
  return (light + 0.05) / (dark + 0.05);
}

function updateContrastMessage() {
  const background = value('backgroundColor');
  const colors = [value('primaryColor')];
  if (control('gradient').checked) colors.push(value('secondaryColor'));
  const ratio = Math.min(...colors.map((color) => contrastRatio(color, background)));
  const message = document.getElementById('contrast-message');
  message.dataset.level = ratio >= 4.5 ? 'good' : ratio >= 3 ? 'okay' : 'warning';
  message.textContent = ratio >= 4.5
    ? `Strong contrast (${ratio.toFixed(1)}:1) — good for scanning.`
    : ratio >= 3
      ? `Usable contrast (${ratio.toFixed(1)}:1) — test before printing.`
      : `Low contrast (${ratio.toFixed(1)}:1) — choose darker modules or a lighter background.`;
}

function qrOptions(payload) {
  const size = Number.parseInt(value('size'), 10);
  const useGradient = control('gradient').checked;
  const gradient = useGradient ? {
    type: 'linear',
    rotation: Number.parseInt(value('gradientRotation'), 10) * Math.PI / 180,
    colorStops: [
      { offset: 0, color: value('primaryColor') },
      { offset: 1, color: value('secondaryColor') },
    ],
  } : undefined;

  return {
    type: 'svg',
    width: size,
    height: size,
    data: payload,
    margin: Number.parseInt(value('margin'), 10),
    qrOptions: { errorCorrectionLevel: value('errorLevel') },
    image: logoDataUrl || undefined,
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: Number.parseInt(value('logoSize'), 10) / 100,
      margin: Number.parseInt(value('logoMargin'), 10),
      saveAsBlob: true,
    },
    dotsOptions: {
      type: value('dotStyle'),
      color: value('primaryColor'),
      gradient,
      roundSize: true,
    },
    cornersSquareOptions: {
      type: value('cornerStyle'),
      color: value('primaryColor'),
    },
    cornersDotOptions: {
      type: value('cornerStyle') === 'square' ? 'square' : 'dot',
      color: useGradient ? value('secondaryColor') : value('primaryColor'),
    },
    backgroundOptions: { color: value('backgroundColor') },
  };
}

function payloadSummary(payload) {
  const oneLine = payload.replace(/\s+/g, ' ');
  return oneLine.length > 74 ? `${oneLine.slice(0, 71)}…` : oneLine;
}

function setStatus(message, state = 'ready') {
  status.textContent = message;
  status.dataset.state = state;
  readyIndicator.textContent = state === 'error' ? 'Needs input' : 'Ready';
  readyIndicator.dataset.state = state;
}

function updateAudioPreview(fields, type) {
  if (type !== 'audio') {
    audioPreview.pause();
    audioPreview.removeAttribute('src');
    audioPreview.hidden = true;
    return;
  }

  try {
    const source = normalizeWebUrl(fields.audioUrl, 'Audio URL');
    if (audioPreview.src !== source) audioPreview.src = source;
    audioPreview.hidden = false;
  } catch {
    audioPreview.pause();
    audioPreview.removeAttribute('src');
    audioPreview.hidden = true;
  }
}

function saveStyle() {
  try {
    const settings = {};
    for (const name of styleFields) {
      const field = control(name);
      settings[name] = field.type === 'checkbox' ? field.checked : field.value;
    }
    localStorage.setItem(styleStorageKey, JSON.stringify(settings));
  } catch {
    // Style persistence is optional; QR generation must work without storage access.
  }
}

function clearSavedStyle() {
  try {
    localStorage.removeItem(styleStorageKey);
  } catch {
    // Storage can be unavailable in privacy-restricted browser contexts.
  }
}

function restoreStyle() {
  try {
    const settings = JSON.parse(localStorage.getItem(styleStorageKey) || '{}');
    for (const name of styleFields) {
      const field = control(name);
      if (!field || settings[name] === undefined) continue;
      if (field.type === 'checkbox') field.checked = Boolean(settings[name]);
      else field.value = settings[name];
    }
  } catch {
    clearSavedStyle();
  }
}

function updateOutputs() {
  document.getElementById('logo-size-value').textContent = `${value('logoSize')}%`;
  document.getElementById('logo-margin-value').textContent = `${value('logoMargin')}px`;
  document.getElementById('margin-value').textContent = `${value('margin')}px`;
}

function updateVisiblePanel() {
  const type = selectedType();
  for (const panel of document.querySelectorAll('[data-content-panel]')) {
    panel.hidden = panel.dataset.contentPanel !== type;
  }
  const password = control('password');
  const openNetwork = value('security') === 'nopass';
  password.disabled = openNetwork;
  if (openNetwork) password.value = '';
}

function renderQr({ announce = false } = {}) {
  const type = selectedType();
  const fields = currentFields();
  updateVisiblePanel();
  updateOutputs();
  updateContrastMessage();
  updateAudioPreview(fields, type);

  try {
    const payload = buildQrPayload(type, fields);
    preview.replaceChildren();
    qrCode = new window.QRCodeStyling(qrOptions(payload));
    qrCode.append(preview);
    latestPayload = payload;
    document.getElementById('summary-type').textContent = typeNames[type];
    document.getElementById('summary-payload').textContent = payloadSummary(payload);
    document.getElementById('summary-size').textContent = `${value('size')} × ${value('size')}`;
    setStatus(announce ? 'QR code generated and ready to download.' : 'Live preview updated.');
    saveStyle();
  } catch (error) {
    preview.replaceChildren();
    qrCode = undefined;
    latestPayload = '';
    document.getElementById('summary-type').textContent = typeNames[type] || '—';
    document.getElementById('summary-payload').textContent = 'Waiting for valid content';
    setStatus(error instanceof Error ? error.message : String(error), 'error');
  }
}

function scheduleRender() {
  window.clearTimeout(renderTimer);
  renderTimer = window.setTimeout(() => renderQr(), 180);
}

function setLogo(dataUrl = '') {
  logoDataUrl = dataUrl;
  logoPreview.replaceChildren();
  if (dataUrl) {
    const image = document.createElement('img');
    image.src = dataUrl;
    image.alt = 'Selected QR logo';
    logoPreview.appendChild(image);
    removeLogoButton.hidden = false;
  } else {
    const empty = document.createElement('span');
    empty.textContent = 'No logo';
    logoPreview.appendChild(empty);
    removeLogoButton.hidden = true;
    logoInput.value = '';
  }
}

logoInput.addEventListener('change', () => {
  const file = logoInput.files?.[0];
  if (!file) return;
  if (!allowedLogoTypes.has(file.type)) {
    setStatus('Choose a PNG, JPG, or WebP logo.', 'error');
    logoInput.value = '';
    return;
  }
  if (file.size > 3 * 1024 * 1024) {
    setStatus('Logo files must be 3 MB or smaller.', 'error');
    logoInput.value = '';
    return;
  }
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    setLogo(String(reader.result));
    renderQr({ announce: true });
  });
  reader.addEventListener('error', () => setStatus('Unable to read that logo.', 'error'));
  reader.readAsDataURL(file);
});

removeLogoButton.addEventListener('click', () => {
  setLogo();
  renderQr({ announce: true });
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  renderQr({ announce: true });
});

form.addEventListener('input', (event) => {
  if (event.target === logoInput) return;
  scheduleRender();
});

form.addEventListener('change', (event) => {
  if (event.target === logoInput) return;
  updateVisiblePanel();
  scheduleRender();
});

form.addEventListener('reset', () => {
  window.setTimeout(() => {
    clearSavedStyle();
    setLogo();
    updateVisiblePanel();
    renderQr({ announce: true });
  });
});

for (const button of document.querySelectorAll('[data-preset]')) {
  button.addEventListener('click', () => {
    const preset = presets[button.dataset.preset];
    for (const [name, setting] of Object.entries(preset)) {
      const field = control(name);
      if (field.type === 'checkbox') field.checked = setting;
      else field.value = setting;
    }
    renderQr({ announce: true });
  });
}

for (const button of document.querySelectorAll('[data-download]')) {
  button.addEventListener('click', async () => {
    if (!qrCode || !latestPayload) {
      setStatus('Generate a valid QR code before downloading.', 'error');
      return;
    }
    const extension = button.dataset.download;
    button.disabled = true;
    try {
      await qrCode.download({ name: `sheekovic-${selectedType()}-qr`, extension });
      setStatus(`${extension.toUpperCase()} download started.`);
    } catch (error) {
      setStatus(`Download failed: ${error instanceof Error ? error.message : String(error)}`, 'error');
    } finally {
      button.disabled = false;
    }
  });
}

document.getElementById('copy-payload').addEventListener('click', async () => {
  if (!latestPayload) {
    setStatus('Generate a valid QR code before copying.', 'error');
    return;
  }
  try {
    await navigator.clipboard.writeText(latestPayload);
    setStatus('Encoded content copied to the clipboard.');
  } catch {
    setStatus('Clipboard access was blocked by the browser.', 'error');
  }
});

if (typeof window.QRCodeStyling !== 'function') {
  setStatus('The QR rendering engine could not be loaded.', 'error');
} else {
  restoreStyle();
  updateVisiblePanel();
  renderQr();
}
