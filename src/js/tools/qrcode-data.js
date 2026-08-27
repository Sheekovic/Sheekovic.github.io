function required(value, label) {
  const normalized = String(value || '').trim();
  if (!normalized) throw new Error(`${label} is required.`);
  return normalized;
}

export function normalizeWebUrl(value, label = 'URL') {
  let candidate = required(value, label);
  if (!/^[a-z][a-z\d+.-]*:/i.test(candidate)) candidate = `https://${candidate}`;

  let url;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error(`${label} must be a valid web address.`);
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(`${label} must use HTTP or HTTPS.`);
  }
  return url.href;
}

export function escapeVCard(value) {
  return String(value || '')
    .replace(/\r\n?/g, '\n')
    .replaceAll('\\', '\\\\')
    .replaceAll('\n', '\\n')
    .replaceAll(';', '\\;')
    .replaceAll(',', '\\,');
}

function optionalVCardLine(lines, name, value) {
  const normalized = String(value || '').trim();
  if (normalized) lines.push(`${name}:${escapeVCard(normalized)}`);
}

export function buildVCard(fields) {
  const fullName = required(fields.name, 'Contact name');
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escapeVCard(fullName)}`,
    `N:;${escapeVCard(fullName)};;;`,
  ];

  optionalVCardLine(lines, 'ORG', fields.organization);
  optionalVCardLine(lines, 'TITLE', fields.jobTitle);
  optionalVCardLine(lines, 'TEL;TYPE=CELL', fields.phone);
  optionalVCardLine(lines, 'EMAIL;TYPE=INTERNET', fields.email);
  if (String(fields.website || '').trim()) {
    lines.push(`URL:${escapeVCard(normalizeWebUrl(fields.website, 'Contact website'))}`);
  }
  const address = String(fields.address || '').trim();
  if (address) lines.push(`ADR;TYPE=WORK:;;${escapeVCard(address)};;;;`);
  optionalVCardLine(lines, 'NOTE', fields.note);
  lines.push('END:VCARD');
  return lines.join('\r\n');
}

function escapeWifi(value) {
  return String(value || '').replace(/([\\;,:"])/g, '\\$1');
}

export function buildWifi(fields) {
  const ssid = required(fields.ssid, 'Network name');
  const security = ['WPA', 'WEP', 'nopass'].includes(fields.security)
    ? fields.security
    : 'WPA';
  const password = security === 'nopass' ? '' : required(fields.password, 'Wi-Fi password');
  return `WIFI:T:${security};S:${escapeWifi(ssid)};P:${escapeWifi(password)};H:${fields.hidden ? 'true' : 'false'};;`;
}

export function buildQrPayload(type, fields) {
  switch (type) {
    case 'url':
      return normalizeWebUrl(fields.url);
    case 'text':
      return required(fields.text, 'Text');
    case 'contact':
      return buildVCard(fields);
    case 'audio':
      return normalizeWebUrl(fields.audioUrl, 'Audio URL');
    case 'wifi':
      return buildWifi(fields);
    default:
      throw new Error('Choose a supported QR content type.');
  }
}
