const input = document.getElementById('input');
const preview = document.getElementById('preview');
let renderedHTML = '';

function sanitizeHTML(source) {
  const template = document.createElement('template');
  template.innerHTML = source;
  template.content.querySelectorAll('script, style, iframe, object, embed, link, meta, base, form, input, button, textarea, select, svg, math').forEach((element) => element.remove());

  template.content.querySelectorAll('*').forEach((element) => {
    for (const attribute of [...element.attributes]) {
      const name = attribute.name.toLowerCase();
      if (name.startsWith('on') || name === 'srcdoc') element.removeAttribute(attribute.name);
      if (!['href', 'src', 'xlink:href'].includes(name)) continue;
      const value = attribute.value.trim();
      if (value.startsWith('#')) continue;
      try {
        const url = new URL(value, window.location.href);
        if (!['http:', 'https:', 'mailto:'].includes(url.protocol)) element.removeAttribute(attribute.name);
      } catch {
        element.removeAttribute(attribute.name);
      }
    }
    if (element.tagName === 'A') {
      element.target = '_blank';
      element.rel = 'noopener noreferrer';
    }
  });

  return template;
}

function updatePreview() {
    const markdown = input.value;
    const sanitized = sanitizeHTML(marked.parse(markdown));
    renderedHTML = sanitized.innerHTML;
    preview.replaceChildren(sanitized.content.cloneNode(true));
}

        input.addEventListener('input', updatePreview);

        // Initial preview
        updatePreview();

async function copyMarkdown() {
    await navigator.clipboard.writeText(input.value);
    alert('Markdown copied to clipboard!');
}

async function copyHTML() {
    await navigator.clipboard.writeText(renderedHTML);
    alert('HTML copied to clipboard!');
}

        function clearAll() {
            input.value = '';
            updatePreview();
        }
