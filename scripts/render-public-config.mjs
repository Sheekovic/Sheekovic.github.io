import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const outputPath = resolve(process.argv[2] || "assets/js/public-config.js");
const required = ["FIREBASE_SHEEKO_API_KEY", "FIREBASE_ACROSSBOARD_API_KEY"];
const missing = required.filter((name) => !process.env[name]);

if (missing.length > 0) {
  throw new Error(`Missing required deployment secrets: ${missing.join(", ")}`);
}

const config = {
  firebase: {
    sheeko: { apiKey: process.env.FIREBASE_SHEEKO_API_KEY },
    acrossboard: { apiKey: process.env.FIREBASE_ACROSSBOARD_API_KEY }
  }
};

const contents = `// Generated during deployment. Do not commit this artifact.\nexport const publicConfig = Object.freeze(${JSON.stringify(config, null, 2)});\n`;
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, contents, { encoding: "utf8", mode: 0o600 });
console.log(`Rendered public configuration: ${outputPath}`);
