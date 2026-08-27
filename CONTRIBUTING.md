# Contributing

Sheekovic Lab is a personal learning workspace. Focused bug fixes, accessibility improvements, performance work, and well-scoped tool enhancements are welcome.

## Before opening a pull request

1. Create a branch from the latest `main`.
2. Keep the change focused and preserve the shared site shell and design tokens.
3. Put source pages in `src/pages`, JavaScript in `src/js`, styles in `src/styles`, and static assets in `public`.
4. Never commit secrets, local environment files, databases, credentials, or generated `dist/` output.
5. Run `npm run check` and fix every failure.

For visual changes, test at desktop width and at a mobile viewport close to 390px. Include a short description of the behavior tested in the pull request.

Pull requests should pass CI and security scanning, then receive a clean Codex review before merge. Address each review thread on the latest commit rather than dismissing unresolved feedback.

Security vulnerabilities must follow [SECURITY.md](SECURITY.md), not the public pull-request process.
