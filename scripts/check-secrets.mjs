import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const patterns = [
  { name: "Google API key", regex: /AIza[0-9A-Za-z_-]{35}/g },
  { name: "GitHub token", regex: /(?:github_pat_|gh[pousr]_)[0-9A-Za-z_]{20,}/g },
  { name: "OpenAI-style key", regex: /sk-[0-9A-Za-z_-]{20,}/g },
  { name: "AWS access key", regex: /AKIA[0-9A-Z]{16}/g },
  { name: "Private key", regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },

];

const trackedFiles = execFileSync(
  "git",
  ["ls-files", "-z", "--cached", "--others", "--exclude-standard"],
  { encoding: "utf8" }
)
  .split("\0")
  .filter(Boolean);
const findings = [];

for (const file of trackedFiles) {
  const buffer = readFileSync(file);
  if (buffer.includes(0)) continue;
  const source = buffer.toString("utf8");

  for (const pattern of patterns) {
    pattern.regex.lastIndex = 0;
    for (const match of source.matchAll(pattern.regex)) {
      const line = source.slice(0, match.index).split("\n").length;
      findings.push(`${file}:${line}: ${pattern.name}`);
    }
  }
}

if (findings.length > 0) {
  console.error("Potential hardcoded secrets found (values redacted):");
  findings.forEach((finding) => console.error(`- ${finding}`));
  process.exitCode = 1;
} else {
  console.log("Secret scan passed: no blocked credential patterns in versionable text files.");
}
