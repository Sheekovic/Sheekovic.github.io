import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";

const sourceRoots = ["assets/js", "scripts"];
const htmlFiles = [
  "code-beautifier.html",
  "donate.html",
  "hash-generator.html",
  "pdf-merger.html",
  "regex-tester.html",
  "sheekryptor.html",
  "youtube.html",
];

const sourceFiles = [];

function collectJavaScriptFiles(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) {
      collectJavaScriptFiles(path);
    } else if ([".js", ".mjs"].includes(extname(entry.name))) {
      sourceFiles.push(path);
    }
  }
}

for (const root of sourceRoots) {
  collectJavaScriptFiles(root);
}

for (const file of sourceFiles) {
  execFileSync(process.execPath, ["--check", file], { stdio: "inherit" });
}

let inlineScriptCount = 0;

function collectInlineScripts(html, file) {
  const normalizedHtml = html.toLowerCase();
  const scripts = [];
  let position = 0;

  while (position < html.length) {
    const openingStart = normalizedHtml.indexOf("<script", position);
    if (openingStart === -1) {
      break;
    }

    const openingEnd = normalizedHtml.indexOf(">", openingStart + 7);
    if (openingEnd === -1) {
      throw new Error(`Malformed script element in ${file}`);
    }

    const closingStart = normalizedHtml.indexOf("</script", openingEnd + 1);
    if (closingStart === -1) {
      throw new Error(`Malformed script element in ${file}`);
    }

    const closingEnd = normalizedHtml.indexOf(">", closingStart + 8);
    if (closingEnd === -1) {
      throw new Error(`Malformed script element in ${file}`);
    }

    scripts.push({
      attributes: html.slice(openingStart + 7, openingEnd),
      source: html.slice(openingEnd + 1, closingStart),
    });
    position = closingEnd + 1;
  }

  return scripts;
}

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");

  for (const { attributes, source } of collectInlineScripts(html, file)) {
    if (/\bsrc\s*=/.test(attributes)) {
      continue;
    }

    const type = attributes.match(/\btype\s*=\s*["']([^"']+)["']/i)?.[1];
    if (type && !["application/javascript", "text/javascript"].includes(type)) {
      continue;
    }

    // Parsing is sufficient here; browser globals are intentionally not executed.
    new Function(source);
    inlineScriptCount += 1;
  }
}

console.log(
  `JavaScript syntax passed: ${sourceFiles.length} source files and ${inlineScriptCount} inline scripts.`,
);
