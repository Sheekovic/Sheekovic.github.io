import assert from "node:assert/strict";

const eventListeners = new Map();
const elements = new Map();
const selectorElements = new Map();
const requests = [];
let openedUrl = null;
let intervalCallback = null;

function createElement(id) {
  return {
    id,
    value: "",
    textContent: "",
    src: "",
    alt: "",
    disabled: false,
    onclick: null,
    addEventListener(type, listener) {
      eventListeners.set(`${id}:${type}`, listener);
    },
  };
}

for (const id of [
  "channelLink",
  "channel-search-button",
  "channelName",
  "YTchannelImage",
  "sub-button",
  "searchStatus",
]) {
  elements.set(id, createElement(id));
}

for (const selector of [
  ".subscribers-odometer",
  ".views-odometer",
  ".videos-odometer",
]) {
  selectorElements.set(selector, createElement(selector));
}

globalThis.document = {
  getElementById(id) {
    return elements.get(id) || null;
  },
  querySelector(selector) {
    return selectorElements.get(selector) || null;
  },
};

globalThis.window = {
  open(url) {
    openedUrl = url;
  },
  setInterval(callback) {
    intervalCallback = callback;
    return 1;
  },
};

globalThis.fetch = async (url) => {
  requests.push(String(url));

  if (String(url).includes("/search/")) {
    return {
      ok: true,
      async json() {
        return {
          items: [
            {
              id: "UCX6OQ3DkcsbYNE6H8uQQuVA",
              handle: "@mrbeast",
              title: "MrBeast",
              pfp: "https://yt3.ggpht.com/example=s88-c-k-c0x00ffffff-no-rj",
            },
          ],
        };
      },
    };
  }

  return {
    ok: true,
    async json() {
      return {
        counters: {
          estimation: {
            subscriberCount: 514993536,
            viewCount: 138231799613,
            videoCount: 999,
          },
          api: {
            subscriberCount: 514000000,
            viewCount: 138219518139,
            videoCount: 999,
          },
        },
      };
    },
  };
};

await import(`../src/js/youtube.js?test=${Date.now()}`);

elements.get("channelLink").value = "https://www.youtube.com/@MrBeast";
await eventListeners.get("channel-search-button:click")();

assert.match(requests[0], /\/search\/%40MrBeast$/);
assert.match(requests[1], /\/UCX6OQ3DkcsbYNE6H8uQQuVA$/);
assert.equal(elements.get("channelName").textContent, "MrBeast");
assert.equal(elements.get("YTchannelImage").src, "https://yt3.ggpht.com/example=s88-c-k-c0x00ffffff-no-rj");
assert.equal(selectorElements.get(".subscribers-odometer").textContent, "514993536");
assert.equal(selectorElements.get(".views-odometer").textContent, "138231799613");
assert.equal(selectorElements.get(".videos-odometer").textContent, "999");
assert.equal(typeof intervalCallback, "function");
assert.equal(elements.get("channel-search-button").disabled, false);
assert.ok(
  requests.every((url) =>
    url.startsWith("https://api.socialcounts.org/youtube-live-subscriber-count/"),
  ),
);

elements.get("sub-button").onclick();
assert.equal(openedUrl, "https://www.youtube.com/channel/UCX6OQ3DkcsbYNE6H8uQQuVA");

console.log("YouTube counter client test passed without server-side secrets.");
