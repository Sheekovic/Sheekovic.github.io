const colorStops = [
  { color: '#667eea', position: 0 },
  { color: '#764ba2', position: 100 },
];

const list = document.getElementById('colorStopsList');
const typeInput = document.getElementById('gradientType');
const angleInput = document.getElementById('angle');
const angleValue = document.getElementById('angleValue');
const angleGroup = document.getElementById('angleGroup');
const preview = document.getElementById('preview');
const cssCode = document.getElementById('cssCode');

function updateGradient() {
  const type = typeInput.value;
  const angle = Number.parseInt(angleInput.value, 10);
  angleValue.textContent = angle;
  angleGroup.hidden = type !== 'linear';

  const stops = [...colorStops]
    .sort((a, b) => a.position - b.position)
    .map((stop) => `${stop.color} ${stop.position}%`)
    .join(', ');
  const gradient = type === 'linear'
    ? `linear-gradient(${angle}deg, ${stops})`
    : `radial-gradient(circle, ${stops})`;

  preview.style.background = gradient;
  cssCode.textContent = `background: ${gradient};`;
}

function renderColorStops() {
  const fragment = document.createDocumentFragment();

  colorStops.forEach((stop, index) => {
    const row = document.createElement('div');
    const color = document.createElement('input');
    const position = document.createElement('input');
    row.className = 'color-stop';

    color.type = 'color';
    color.value = stop.color;
    color.setAttribute('aria-label', `Color stop ${index + 1}`);
    color.addEventListener('input', () => {
      stop.color = color.value;
      updateGradient();
    });

    position.type = 'number';
    position.min = '0';
    position.max = '100';
    position.value = stop.position;
    position.setAttribute('aria-label', `Position for color stop ${index + 1}`);
    position.addEventListener('input', () => {
      stop.position = Math.min(100, Math.max(0, Number.parseInt(position.value, 10) || 0));
      updateGradient();
    });

    row.append(color, position);
    if (colorStops.length > 2) {
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'remove-btn';
      remove.textContent = '×';
      remove.setAttribute('aria-label', `Remove color stop ${index + 1}`);
      remove.addEventListener('click', () => {
        colorStops.splice(index, 1);
        renderColorStops();
        updateGradient();
      });
      row.appendChild(remove);
    } else {
      row.appendChild(document.createElement('span'));
    }
    fragment.appendChild(row);
  });

  list.replaceChildren(fragment);
}

async function copyCode() {
  await navigator.clipboard.writeText(cssCode.textContent);
  const original = document.getElementById('copy-gradient').textContent;
  document.getElementById('copy-gradient').textContent = 'Copied';
  window.setTimeout(() => {
    document.getElementById('copy-gradient').textContent = original;
  }, 1200);
}

document.getElementById('add-color-stop').addEventListener('click', () => {
  const lastPosition = colorStops.at(-1).position;
  colorStops.push({ color: '#764ba2', position: Math.min(lastPosition + 10, 100) });
  renderColorStops();
  updateGradient();
});
document.getElementById('copy-gradient').addEventListener('click', copyCode);
document.getElementById('back-to-tools').addEventListener('click', () => {
  window.location.href = '/tools.html';
});
typeInput.addEventListener('change', updateGradient);
angleInput.addEventListener('input', updateGradient);

renderColorStops();
updateGradient();
