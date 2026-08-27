# Security Policy

## Supported code

This site does not publish versioned releases. Security fixes are applied to the latest code on the `main` branch and the current GitHub Pages deployment. Old commits, forks, downloaded APKs, and third-party services are not maintained as separate supported versions.

## Report a vulnerability privately

Use [GitHub private vulnerability reporting](https://github.com/Sheekovic/Sheekovic.github.io/security/advisories/new) for suspected vulnerabilities involving this repository or its deployed site.

Please include:

- The affected URL, file, or workflow.
- Clear reproduction steps and the security impact.
- A minimal proof of concept, with secrets and personal data removed.
- Any mitigation you have already tested.

Do not open a public issue, pull request, or discussion for an unpatched vulnerability. Do not include live credentials, tokens, private keys, personal data, or destructive payloads in a report.

## Response expectations

- Initial acknowledgement: within 3 business days.
- Status updates: at least every 7 days while the report is being investigated.
- Resolution: depends on severity and complexity; confirmed high-impact issues are prioritized.

You will be told whether the report is accepted, needs more information, is a duplicate, or is outside this project's scope. Please allow a reasonable remediation window before public disclosure.

## Scope

In scope includes the static site code, client-side tools, Firebase integration owned by this project, GitHub Actions workflows, and the content deployed to `sheekovic.github.io`.

Availability issues in third-party APIs, unsupported browsers, social-engineering requests, and reports that require attacking other users or services are outside scope. Non-security bugs and feature requests belong in [GitHub Issues](https://github.com/Sheekovic/Sheekovic.github.io/issues).
