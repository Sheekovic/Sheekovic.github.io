import assert from 'node:assert/strict';

const renderedLinks = [];
globalThis.document = {
  createElement(tagName) {
    assert.equal(tagName, 'a');
    return { href: '', textContent: '' };
  },
  getElementById(id) {
    assert.equal(id, 'sitemap-tools');
    return {
      append(link) {
        renderedLinks.push(link);
      },
    };
  },
};

await import('../src/js/sitemap.js');

assert.ok(renderedLinks.length > 0, 'The sitemap must render tool links');
for (const link of renderedLinks) {
  assert.match(link.href, /^\/[a-z0-9/-]+\.html$/i);
  assert.ok(link.textContent, 'Every sitemap tool link needs a label');
}

console.log(`Sitemap client test passed: ${renderedLinks.length} tool links.`);
