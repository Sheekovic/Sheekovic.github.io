import { tools } from './tool-catalog.js';

const list = document.getElementById('sitemap-tools');
for (const tool of tools) {
  const link = document.createElement('a');
  link.href = tool.file;
  link.textContent = tool.name;
  list.append(link);
}
