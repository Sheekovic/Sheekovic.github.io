import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { dirname, extname, join, relative, resolve, sep } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const outputRoot = resolve(projectRoot, process.argv[2] || "dist");
const pagesRoot = resolve(projectRoot, "src/pages");
const publicRoot = resolve(projectRoot, "public");
const javascriptRoot = resolve(projectRoot, "src/js");
const stylesRoot = resolve(projectRoot, "src/styles");

const browserOnlyExcludes = new Set([
  "auth_github_provider_create.js",
  "auth_github_signin_popup.js",
  "auth_github_signin_redirect_result.js",
  "auth_sign_out.js",
  "auth_signin_redirect.js",
  "check-sqlite.js",
  "create_user_data_db.js",
  "github-login.js",
  "pop-upHandler.js",
  "protection.js",
  "server.js",
  "sqlapp.js",
]);

const sharedStylesheet = '<link rel="stylesheet" href="/assets/css/site.css">';
const sharedScript = '<script type="module" src="/assets/js/site.js"></script>';

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

function injectSharedAssets(html) {
  let output = html;

  if (!output.includes('/assets/css/site.css')) {
    output = output.replace(/<\/head>/i, `  ${sharedStylesheet}\n</head>`);
  }

  if (!output.includes('/assets/js/site.js')) {
    output = output.replace(/<\/body>/i, `  ${sharedScript}\n</body>`);
  }

  return output;
}

async function buildPages() {
  for (const sourcePath of await walk(pagesRoot)) {
    const destinationPath = join(outputRoot, relative(pagesRoot, sourcePath));
    await mkdir(dirname(destinationPath), { recursive: true });

    if (extname(sourcePath).toLowerCase() === ".html") {
      const html = await readFile(sourcePath, "utf8");
      await writeFile(destinationPath, injectSharedAssets(html), "utf8");
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
    for (const match of html.matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
      const reference = match[1].split(/[?#]/, 1)[0];
      if (!/\.(?:css|js)$/i.test(reference) || /^(?:[a-z]+:|\/\/)/i.test(reference)) continue;

      const target = reference.startsWith("/")
        ? join(outputRoot, reference.slice(1))
        : resolve(dirname(file), reference);
      const details = await stat(target).catch(() => null);
      if (!details?.isFile()) {
        throw new Error(
          `Broken local asset in ${relative(outputRoot, file)}: ${reference}`,
        );
      }
    }
  }
}

await rm(outputRoot, { recursive: true, force: true });
await mkdir(join(outputRoot, "assets/js"), { recursive: true });
await mkdir(join(outputRoot, "assets/css"), { recursive: true });

await copyDirectory(publicRoot, outputRoot);
await copyDirectory(javascriptRoot, join(outputRoot, "assets/js"), (_path, name) => {
  const normalized = name.split(sep).join("/");
  return !browserOnlyExcludes.has(normalized);
});
await copyDirectory(stylesRoot, join(outputRoot, "assets/css"));
await buildPages();
await assertBuild();

console.log(`Static site built in ${relative(projectRoot, outputRoot) || "."}.`);
