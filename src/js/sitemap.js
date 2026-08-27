import { toolCatalog } from './tool-catalog.js';

const list = document.getElementById('sitemap-tools');
for (const tool of toolCatalog) {
  const link = document.createElement('a');
  link.href = tool.href;
  link.textContent = tool.name;
  list.append(link);
}
