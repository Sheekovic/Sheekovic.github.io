import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";

const sourceRoots = ["assets/js", "scripts", "netlify/functions"];
const htmlFiles = [
  "code-beautifier.html",
  "donate.html",
  "hash-generator.html",
  "pdf-merger.html",
  "regex-tester.html",
  "sheekryptor.html",
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

const inlineScriptPattern = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
let inlineScriptCount = 0;

for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");

  for (const match of html.matchAll(inlineScriptPattern)) {
    const attributes = match[1];
    const source = match[2];

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
