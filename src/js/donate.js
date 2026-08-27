const address = document.getElementById('usdt-address');
const copyButton = document.getElementById('copy-address');
const copyStatus = document.getElementById('copy-status');

copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(address.textContent.trim());
    copyStatus.textContent = 'Address copied.';
  } catch {
    copyStatus.textContent = 'Copy failed. Select the address and copy it manually.';
  }
});

if (typeof QRCode === 'function') {
  document.querySelectorAll('[data-qr]').forEach((container) => {
    new QRCode(container, {
      text: container.dataset.qr,
      width: 144,
      height: 144,
      colorDark: '#07111f',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H,
    });
  });
}
