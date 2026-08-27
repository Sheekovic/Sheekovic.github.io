// Safe defaults for local/static source. GitHub Actions replaces this file in
// the Pages artifact; secret values must never be committed here.
export const publicConfig = Object.freeze({
  firebase: Object.freeze({
    sheeko: Object.freeze({ apiKey: "" }),
    acrossboard: Object.freeze({ apiKey: "" })
  })
});
