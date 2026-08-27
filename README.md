# Sheekovic Lab

Sheekovic Lab is my personal space for learning in public, testing ideas, and turning small experiments into useful browser tools. The repository is intentionally a living workspace: some pages are polished utilities, while others document things I am currently exploring.

The site is built with plain HTML, CSS, and JavaScript, then published as a static artifact on GitHub Pages. Performance, accessibility, and reliability come before adding more features.

## What is here

- A searchable collection of calculators, converters, developer helpers, and media tools.
- Small personal projects such as AcrossBoard and the YouTube live counter.
- A shared responsive design system with dark and light themes.
- A dependency-free static build with link, asset, syntax, secret, and regression checks.

Most tool input is processed in the browser. Features that fetch live data, authenticate with Firebase, or load a documented third-party library necessarily contact an external service.

## Project structure

```text
src/
  pages/          Source HTML pages
  js/             Shared scripts and page logic
    tools/        Tool-specific JavaScript
  styles/         Shared and page-specific CSS
    tools/        Tool-specific styles
public/           Images, feeds, verification files, and downloadable assets
scripts/          Build and validation scripts
dist/             Generated deployment artifact (not committed)
```

## Local development

Node.js 22 or newer is required.

```bash
npm ci
npm run check
```

`npm run check` scans for blocked credential patterns, validates JavaScript, tests the YouTube counter client, builds the site, and checks local links and assets.

To build without the other checks:

```bash
npm run build
```

Serve `dist/` with any local static server. Do not open source HTML files directly because root-relative assets and ES modules expect an HTTP origin.

## Configuration and deployment

Pushes to `main` build `dist/` and deploy it through GitHub Actions. Browser-visible Firebase configuration is rendered only into the deployment artifact from GitHub repository secrets. See [SECRETS_SETUP.md](SECRETS_SETUP.md) for the required names and rotation workflow.

Never commit credentials, private keys, session data, or generated local secret reports. Run `npm run check:secrets` before pushing.

## Contributing

This is primarily a personal learning repository, but focused fixes and improvements are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md), keep changes small, and include `npm run check` results in the pull request.

## Security and license

Report vulnerabilities privately using the process in [SECURITY.md](SECURITY.md). Do not open a public issue for a suspected vulnerability or exposed credential.

Original project code is available under the [MIT License](LICENSE). Third-party components retain their own licenses; see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Author

Ahmed F. Wahballah — [GitHub](https://github.com/Sheekovic)
