import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve, sep } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const outputRoot = resolve(projectRoot, process.argv[2] || "dist");
const pagesRoot = resolve(projectRoot, "src/pages");
const publicRoot = resolve(projectRoot, "public");
const javascriptRoot = resolve(projectRoot, "src/js");
const stylesRoot = resolve(projectRoot, "src/styles");

const sharedStylesheet = '<link rel="stylesheet" href="/assets/css/site.css">';
const sharedScript = '<script type="module" src="/assets/js/site.js"></script>';

const toolPages = new Set([
  "age.html", "base64.html", "binance.html", "bmi-calculator.html",
  "box-shadow-generator.html", "code-beautifier.html", "color-converter.html",
  "currency-converter.html", "file-size-calc.html", "gradient-generator.html",
  "hash-generator.html", "image-compressor.html", "json-formatter.html",
  "loan-calculator.html", "lorem-ipsum.html", "markdown-preview.html",
  "password.html", "pdf-merger.html", "percentage-calc.html", "qrcode.html",
  "regex-tester.html", "text-to-speech.html", "tip-calculator.html", "to-do.html",
  "unit-converter.html", "url-tool.html", "youtube.html",
]);

function pageDetails(pagePath) {
  const normalized = pagePath.split(sep).join("/");
  const filename = normalized.split("/").at(-1);
  const slug = normalized.replace(/\/index\.html$/, "").replace(/\.html$/, "").replaceAll("/", "-") || "home";
  let kind = "content";
  if (normalized === "index.html") kind = "home";
  else if (normalized === "tools.html") kind = "tools";
  else if (toolPages.has(filename)) kind = "tool";
  else if (normalized === "acrossboard/app.html") kind = "app";
  else if (["login.html", "profile.html", "acrossboard/index.html"].includes(normalized)) kind = "auth";
  return { normalized, filename, slug, kind };
}

function navigationLink(href, label, active) {
  return `<a href="${href}"${active ? ' aria-current="page"' : ""}>${label}</a>`;
}

function siteHeader(details) {
  const toolsActive = details.kind === "tool" || details.kind === "tools";
  return `<header class="site-header" data-site-shell>
    <div class="site-header__inner">
      <a class="site-brand" href="/" aria-label="Sheekovic home"><span class="site-brand__mark" aria-hidden="true">S</span><span>Sheekovic <small>Lab</small></span></a>
      <button class="site-menu-button" type="button" aria-expanded="false" aria-controls="site-navigation"><span class="sr-only">Toggle navigation</span><span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span></button>
      <nav class="site-navigation" id="site-navigation" aria-label="Primary navigation">
        ${navigationLink("/", "Home", details.kind === "home")}
        ${navigationLink("/tools.html", "Tools", toolsActive)}
        ${navigationLink("/github.html", "Projects", details.filename === "github.html")}
        ${navigationLink("/acrossboard.html", "AcrossBoard", details.normalized.startsWith("acrossboard"))}
        <a href="https://github.com/Sheekovic" target="_blank">GitHub</a>
        <button class="site-theme-button" id="site-theme-toggle" type="button" aria-label="Switch color theme"><span aria-hidden="true">◐</span><span class="site-theme-label">Theme</span></button>
      </nav>
    </div>
  </header>`;
}

function siteFooter() {
  return `<footer class="site-footer" data-site-shell>
    <div class="site-footer__inner">
      <div><strong>Sheekovic Lab</strong><p>A personal space for learning, building, and useful experiments.</p></div>
      <nav aria-label="Footer navigation"><a href="/tools.html">Tools</a><a href="/sitemap.html">Sitemap</a><a href="https://github.com/Sheekovic" target="_blank">GitHub</a></nav>
      <small>© ${new Date().getUTCFullYear()} Ahmed F. Wahballah</small>
    </div>
  </footer>`;
}

function decorateBody(html, details) {
  const classes = `site-unified site-${details.kind}-page page-${details.slug}`;
  return html.replace(/<body([^>]*)>/i, (tag, attributes) => {
    if (/\bclass\s*=/.test(attributes)) {
      return tag.replace(/\bclass\s*=\s*(["'])(.*?)\1/i, (_match, quote, value) => `class=${quote}${value} ${classes}${quote}`);
    }
    return `<body${attributes} class="${classes}">`;
  });
}

async function copyDirectory(source, destination, filter = () => true) {
  await cp(source, destination, {
    recursive: true,
    filter: (path) => filter(path, relative(source, path)),
  });
}

async function walk(directory) {
  const files = [];

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else files.push(path);
  }

  return files;
}

function injectSharedAssets(html, pagePath) {
  const details = pageDetails(pagePath);
  let output = decorateBody(html, details);

  if (!output.includes('/assets/css/site.css')) {
    output = output.replace(/<\/head>/i, `  ${sharedStylesheet}\n</head>`);
  }

  if (!output.includes('/assets/js/site.js')) {
    output = output.replace(/<body[^>]*>/i, (body) => `${body}\n  ${siteHeader(details)}`);
    output = output.replace(/<\/body>/i, `  ${siteFooter()}\n  ${sharedScript}\n</body>`);
  }

  return output;
}

async function buildPages() {
  for (const sourcePath of await walk(pagesRoot)) {
    const destinationPath = join(outputRoot, relative(pagesRoot, sourcePath));
    await mkdir(dirname(destinationPath), { recursive: true });

    if (extname(sourcePath).toLowerCase() === ".html") {
      const html = await readFile(sourcePath, "utf8");
      await writeFile(destinationPath, injectSharedAssets(html, relative(pagesRoot, sourcePath)), "utf8");
    } else {
      await cp(sourcePath, destinationPath);
    }
  }
}

async function assertBuild() {
  const requiredFiles = [
    "index.html",
    "tools.html",
    "youtube.html",
    "404.html",
    "assets/css/site.css",
    "assets/js/site.js",
    "assets/js/youtube.js",
    "acrossboard/app.html",
    "api/api.html",
  ];

  for (const file of requiredFiles) {
    const details = await stat(join(outputRoot, file)).catch(() => null);
    if (!details?.isFile()) throw new Error(`Build is missing required file: ${file}`);
  }

  for (const file of await walk(outputRoot)) {
    const extension = extname(file).toLowerCase();

    if (extension === ".js") {
      const source = await readFile(file, "utf8");
      const importPattern = /(?:import\s+(?:[^"']*?\s+from\s+)?|export\s+[^"']*?\s+from\s+)["'](\.{1,2}\/[^"']+)["']/g;

      for (const match of source.matchAll(importPattern)) {
        const reference = match[1].split(/[?#]/, 1)[0];
        const target = resolve(dirname(file), reference);
        const details = await stat(target).catch(() => null);
        if (!details?.isFile()) {
          throw new Error(
            `Broken local module import in ${relative(outputRoot, file)}: ${reference}`,
          );
        }
      }
    }

    if (extension !== ".html") continue;

    const html = await readFile(file, "utf8");
    const htmlPath = relative(outputRoot, file);
    const isDocument = /<html\b/i.test(html);

    // Ownership-verification files intentionally contain only a provider token.
    if (!isDocument) continue;

    if (!/<meta\s+name=["']viewport["']/i.test(html)) {
      throw new Error(`Missing viewport metadata in ${htmlPath}`);
    }

    for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
      const attributes = match[1];
      const contents = match[2].trim();
      const isStructuredData = /type\s*=\s*["']application\/ld\+json["']/i.test(attributes);
      if (!/\bsrc\s*=/i.test(attributes) && contents && !isStructuredData) {
        throw new Error(`Inline JavaScript is not allowed in ${htmlPath}`);
      }
    }

    for (const match of html.matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
      const rawReference = match[1];
      if (/^(?:#|\/\/)/i.test(rawReference)) continue;
      if (/^[a-z]+:/i.test(rawReference)) {
        const siteOrigin = "https://sheekovic.github.io/";
        if (!rawReference.startsWith(siteOrigin)) continue;
      }
      const reference = rawReference.split(/[?#]/, 1)[0];
      if (!reference || reference.includes('${')) continue;

      const decodedReference = decodeURIComponent(
        reference.replace("https://sheekovic.github.io/", "/"),
      );
      const target = decodedReference.startsWith("/")
        ? join(outputRoot, decodedReference.slice(1))
        : resolve(dirname(file), decodedReference);
      const candidates = [target];
      if (!extname(target)) candidates.push(`${target}.html`, join(target, "index.html"));
      const exists = await Promise.all(candidates.map(async (candidate) => {
        const details = await stat(candidate).catch(() => null);
        return details?.isFile() || (details?.isDirectory() && (await stat(join(candidate, "index.html")).catch(() => null))?.isFile());
      }));
      if (!exists.some(Boolean)) {
        throw new Error(`Broken local reference in ${relative(outputRoot, file)}: ${reference}`);
      }
    }
  }
}

await rm(outputRoot, { recursive: true, force: true });
await mkdir(join(outputRoot, "assets/js"), { recursive: true });
await mkdir(join(outputRoot, "assets/css"), { recursive: true });

await copyDirectory(publicRoot, outputRoot);
await copyDirectory(javascriptRoot, join(outputRoot, "assets/js"));
await copyDirectory(stylesRoot, join(outputRoot, "assets/css"));
await buildPages();
await assertBuild();

console.log(`Static site built in ${relative(projectRoot, outputRoot) || "."}.`);
