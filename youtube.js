const socialCountsApi = "https://api.socialcounts.org/youtube-live-subscriber-count";

let liveChannelId = null;
let intervalId = null;
let refreshInProgress = false;

const channelInput = document.getElementById("channelLink");
const searchButton = document.getElementById("channel-search-button");
const channelNameElement = document.getElementById("channelName");
const channelImageElement = document.getElementById("YTchannelImage");
const subscribeButton = document.getElementById("sub-button");
const statusElement = document.getElementById("searchStatus");
const subscriberElement = document.querySelector(".subscribers-odometer");
const viewsElement = document.querySelector(".views-odometer");
const videosElement = document.querySelector(".videos-odometer");

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  const data = await response.json().catch(() => null);

  if (!response.ok || !data) {
    throw new Error(data?.error || "Unable to load YouTube data right now.");
  }

  return data;
}

function parseChannelInput(value) {
  const input = value.trim();
  const channelId = input.match(/\bUC[A-Za-z0-9_-]{20,}\b/)?.[0];
  if (channelId) {
    return { channelId };
  }

  let query = input;

  try {
    const candidate = /^https?:\/\//i.test(input) ? input : `https://${input}`;
    const url = new URL(candidate);

    if (/(^|\.)youtube\.com$/i.test(url.hostname)) {
      const segments = url.pathname.split("/").filter(Boolean);
      const handle = segments.find((segment) => segment.startsWith("@"));

      if (handle) {
        query = handle;
      } else if (["c", "user"].includes(segments[0]?.toLowerCase())) {
        query = segments[1] || input;
      }
    }
  } catch {
    // Plain names and handles are valid search queries.
  }

  query = query.trim();
  return query ? { query } : {};
}

async function searchChannels(query) {
  const data = await fetchJson(`${socialCountsApi}/search/${encodeURIComponent(query)}`);
  return Array.isArray(data.items) ? data.items : [];
}

async function resolveChannel(value) {
  const { channelId, query } = parseChannelInput(value);
  const searchTerm = channelId || query;

  if (!searchTerm) {
    throw new Error("Enter a YouTube channel link, @handle, name, or channel ID.");
  }

  const channels = await searchChannels(searchTerm);
  if (channels.length === 0) {
    throw new Error("Channel not found.");
  }

  if (channelId) {
    return channels.find((channel) => channel.id === channelId) || channels[0];
  }

  const normalizedQuery = query.replace(/^@/, "").toLowerCase();
  return (
    channels.find((channel) => channel.handle?.replace(/^@/, "").toLowerCase() === normalizedQuery) ||
    channels.find((channel) => channel.title?.toLowerCase() === normalizedQuery) ||
    channels[0]
  );
}

function finiteNumber(...values) {
  for (const value of values) {
    const number = Number(value);
    if (Number.isFinite(number)) return number;
  }
  return 0;
}

async function fetchStatistics(channelId) {
  const data = await fetchJson(`${socialCountsApi}/${encodeURIComponent(channelId)}`);
  const estimated = data.counters?.estimation || {};
  const api = data.counters?.api || {};

  return {
    subscribers: finiteNumber(estimated.subscriberCount, api.subscriberCount),
    views: finiteNumber(estimated.viewCount, api.viewCount),
    videos: finiteNumber(estimated.videoCount, api.videoCount),
  };
}

function updateOdometers({ subscribers, views, videos }) {
  subscriberElement.textContent = String(subscribers);
  viewsElement.textContent = String(views);
  videosElement.textContent = String(videos);
}

function safeChannelImage(value) {
  try {
    const url = new URL(value);
    const trustedHost = /(^|\.)(ggpht\.com|googleusercontent\.com)$/i.test(url.hostname);
    if (url.protocol === "https:" && trustedHost) return url.href;
  } catch {
    // Invalid or unexpected image URLs use the local fallback.
  }

  return "images/youtubeicon.png";
}

function applyChannel(channel) {
  if (!/^[A-Za-z0-9_-]{10,64}$/.test(channel.id || "")) {
    throw new Error("The channel service returned an invalid channel ID.");
  }

  liveChannelId = channel.id;
  channelNameElement.textContent = channel.title || channel.handle || channel.id;
  channelImageElement.src = safeChannelImage(channel.pfp);
  channelImageElement.alt = `${channelNameElement.textContent} channel image`;
  subscribeButton.onclick = () => {
    window.open(`https://www.youtube.com/channel/${liveChannelId}`, "_blank", "noopener");
  };
}

async function refreshStatistics() {
  if (!liveChannelId || refreshInProgress) return;

  refreshInProgress = true;
  try {
    updateOdometers(await fetchStatistics(liveChannelId));
    statusElement.textContent = `Live data updated at ${new Date().toLocaleTimeString()}`;
  } finally {
    refreshInProgress = false;
  }
}

async function loadChannel() {
  clearInterval(intervalId);
  intervalId = null;
  searchButton.disabled = true;
  statusElement.textContent = "Loading channel...";

  try {
    const channel = await resolveChannel(channelInput.value);
    applyChannel(channel);
    await refreshStatistics();

    intervalId = window.setInterval(() => {
      refreshStatistics().catch((error) => {
        console.warn("Unable to refresh YouTube statistics:", error.message);
        statusElement.textContent = "Live refresh is temporarily unavailable.";
      });
    }, 10000);
  } catch (error) {
    console.error("Unable to load YouTube channel:", error);
    statusElement.textContent = error.message;
  } finally {
    searchButton.disabled = false;
  }
}

searchButton?.addEventListener("click", loadChannel);
channelInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") loadChannel();
});
