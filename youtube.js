import { publicConfig } from "./assets/js/public-config.js";

const apiBaseUrl = publicConfig.apiBaseUrl.replace(/\/$/, "");
let liveChannelId = null;
let intervalId = null;
let currentSubCount = 0;
let estimatedSubCount = 0;
let apiSubCount = 0;
let channelViews = 0;
let videoCount = 0;

const subscriberElement = document.querySelector(".subscribers-odometer");
const viewsElement = document.querySelector(".views-odometer");
const videosElement = document.querySelector(".videos-odometer");

async function fetchBackend(action, parameters) {
  const query = new URLSearchParams({ action, ...parameters });
  const response = await fetch(`${apiBaseUrl}/.netlify/functions/youtube?${query}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || data.error || "Unable to load YouTube data.");
  }

  return data;
}

async function fetchChannelId() {
  const channelLink = document.getElementById("channelLink").value.trim();
  if (!channelLink) {
    alert("Please enter a YouTube channel link.");
    return;
  }

  const usernameMatch = channelLink.match(/youtube\.com\/@([\w-]+)/i);
  const channelIdMatch = channelLink.match(/youtube\.com\/channel\/([\w-]+)/i);
  clearInterval(intervalId);

  try {
    if (channelIdMatch) {
      liveChannelId = channelIdMatch[1];
      await fetchAllStatistics(liveChannelId);
    } else if (usernameMatch) {
      await fetchChannelIdByUsername(usernameMatch[1]);
    } else {
      alert("Invalid YouTube channel link.");
    }
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    alert(error.message);
  }
}

async function fetchChannelIdByUsername(username) {
  const data = await fetchBackend("search", { q: username });
  const channel = data.items?.[0];

  if (!channel) {
    throw new Error("Channel not found.");
  }

  liveChannelId = channel.id.channelId;
  document.getElementById("channelName").textContent = channel.snippet.title;
  document.getElementById("YTchannelImage").src =
    channel.snippet.thumbnails.high?.url ||
    channel.snippet.thumbnails.medium?.url ||
    channel.snippet.thumbnails.default?.url;
  document.getElementById("sub-button").onclick = () => {
    window.open(`https://www.youtube.com/channel/${liveChannelId}`, "_blank", "noopener");
  };

  await fetchAllStatistics(liveChannelId);
}

async function fetchYouTubeStatistics(channelId) {
  const data = await fetchBackend("statistics", { id: channelId });
  const statistics = data.items?.[0]?.statistics;

  if (!statistics) {
    throw new Error("YouTube statistics are unavailable for this channel.");
  }

  apiSubCount = Number.parseInt(statistics.subscriberCount || "0", 10);
  channelViews = Number.parseInt(statistics.viewCount || "0", 10);
  videoCount = Number.parseInt(statistics.videoCount || "0", 10);
}

async function fetchSocialCounts(channelId) {
  try {
    const response = await fetch(
      `https://api.socialcounts.org/youtube-live-subscriber-count/${encodeURIComponent(channelId)}`
    );
    if (!response.ok) return;

    const data = await response.json();
    estimatedSubCount = Number(data.est_sub) || apiSubCount;
    channelViews = Number(data.table?.find((item) => item.name === "Channel Views")?.count) || channelViews;
    videoCount = Number(data.table?.find((item) => item.name === "Videos")?.count) || videoCount;
  } catch (error) {
    console.warn("SocialCounts data is unavailable:", error.message);
    estimatedSubCount = apiSubCount;
  }
}

async function fetchAllStatistics(channelId) {
  clearInterval(intervalId);
  await Promise.all([fetchYouTubeStatistics(channelId), fetchSocialCounts(channelId)]);
  currentSubCount = estimatedSubCount || apiSubCount;
  updateOdometers(currentSubCount, channelViews, videoCount);
  startLiveCounter();
}

function updateOdometers(subscribers, views, videos) {
  if (subscriberElement) subscriberElement.textContent = String(subscribers ?? 0);
  if (viewsElement) viewsElement.textContent = String(views ?? 0);
  if (videosElement) videosElement.textContent = String(videos ?? 0);
}

function startLiveCounter() {
  if (!estimatedSubCount || !apiSubCount) return;

  intervalId = setInterval(async () => {
    const rangeMin = Math.min(estimatedSubCount, apiSubCount);
    const rangeMax = Math.max(estimatedSubCount, apiSubCount);
    const randomStep = Math.floor(Math.random() * 3) + 1;

    if (currentSubCount < rangeMax) currentSubCount = Math.min(rangeMax, currentSubCount + randomStep);
    else if (currentSubCount > rangeMin) currentSubCount = Math.max(rangeMin, currentSubCount - randomStep);

    updateOdometers(currentSubCount, channelViews, videoCount);
    await fetchSocialCounts(liveChannelId);
  }, 10000);
}

document.getElementById("channel-search-button")?.addEventListener("click", fetchChannelId);
document.getElementById("channelLink")?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") fetchChannelId();
});
