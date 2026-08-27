# Secrets and deployment setup

The repository source contains no runtime credential values. GitHub Pages is a
static host, so server-only keys must not be rendered into its JavaScript.

## GitHub Repository Secrets

Configure these under **Settings > Secrets and variables > Actions > Secrets**:

- `FIREBASE_SHEEKO_API_KEY`
- `FIREBASE_ACROSSBOARD_API_KEY`
- `FIREBASE_ACROSSBOARD_ANDROID_API_KEY`
- `YOUTUBE_API_KEY_1`
- `YOUTUBE_API_KEY_2`
- `YOUTUBE_API_KEY_3`
- `YOUTUBE_API_KEY_4`

The Firebase Web API keys are used to render the Pages artifact. Firebase Web
configuration is public by design and remains visible in the deployed browser
JavaScript. Restrict each key to the correct APIs and HTTP referrers, enable
Firebase App Check where supported, and enforce Authentication, Realtime
Database, Firestore, and Storage rules.

`FIREBASE_ACROSSBOARD_ANDROID_API_KEY` was found in the prebuilt
`AcrossBoard_v1.0.0.apk`. Android client keys are necessarily present in the
installed app. The existing APK cannot consume a repository secret at runtime;
rebuild it with a rotated key restricted to the Android package name and signing
certificate fingerprint, then replace the checked-in binary.

The YouTube keys are retained as repository secrets for rotation/recovery, but
the browser never receives them. Runtime requests go through the Netlify
function and read the same names from Netlify's production Functions scope.

## GitHub Repository Variable

- `PUBLIC_API_BASE_URL=https://sheekovic.netlify.app`

## Netlify Function secrets

Configure `YOUTUBE_API_KEY_1` through `YOUTUBE_API_KEY_4` for the production
context and Functions scope. Mark them as secret values.

## Rotation checklist

1. Revoke all legacy values reported by GitHub Secret Scanning.
2. Create replacement keys with API and application restrictions.
3. Update both GitHub and Netlify secret stores with the replacements.
4. Trigger the GitHub Pages workflow and a Netlify production deploy.
5. Verify Firebase sign-in and the YouTube counter from the public site.
6. Resolve the corresponding GitHub Secret Scanning alerts as revoked.

Run `node scripts/check-secrets.mjs` before every commit. The CI and Pages
workflows run the same redacted scan automatically.
