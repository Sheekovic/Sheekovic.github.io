const apiKey = "AIzaSyDD0Q2sXnnLjYe2KJZcBtiPOMNJdn9GWnU";
const apiKey2 = "AIzaSyAP4TfbfZO4cladd0dnrqn6sguT4LHiNpM";
const apiKey3 = "AIzaSyA9qY7jQvaTX__uIev6nAuK2Qz8gSXLZjQ";
const apiKey4 = "AIzaSyAGOdobIqly4cnnlXDdhXWLsv33FQPqyek";
let liveChannelId = null;
let intervalId = null;
let currentSubCount = 0;
let estSubCount = 0; // SocialCounts est_sub
let apiSubCount = 0; // YouTube API sub count
let channelViews = 0;
let videoCount = 0;
const createOdometer = (el, value) => {
    const odometer = new Odometer({
        el: el,
        value: 0,
    });

    let.hasRun = false;

    const options = {
        threshold: [0, 0.9],
    };

    const callback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!hasRun) {
                    odometer.update(value);
                    hasRun = true;
                }
            }
        });
    }
    const observer = new IntersectionObserver(callback, options);
    observer.observe(el);
};

const SubOdometer = document.querySelector(".subscribers-odometer")
const ViewOdometer = document.querySelector(".views-odometer")
const VideoOdometer = document.querySelector(".videos-odometer")

async function fetchChannelId() {
    const channelLink = document.getElementById("channelLink").value.trim();
    if (!channelLink) {
        alert("Please enter a YouTube channel link.");
        return;
    }

    const usernameMatch = channelLink.match(/youtube\.com\/@([\w-]+)/);
    const channelIdMatch = channelLink.match(/youtube\.com\/channel\/([\w-]+)/);

    if (intervalId) clearInterval(intervalId);

    if (channelIdMatch) {
        liveChannelId = channelIdMatch[1];
        fetchAllStatistics(liveChannelId);
    } else if (usernameMatch) {
        const username = usernameMatch[1];
        await fetchChannelIdByUsername(username);
    } else {
        alert("Invalid YouTube channel link.");
    }
}

async function fetchChannelIdByUsername(username) {
    try {
        const keys = [apiKey, apiKey2, apiKey3, apiKey4]; // Array of API keys
        let keyIndex = 0; // Start with the first key
        const fetchWithKey = async (key) => {
            const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${username}&key=${key}`;
            const response = await fetch(apiUrl);

            if (response.status === 403) {
                keyIndex++;
                if (keyIndex < keys.length) {
                    return await fetchWithKey(keys[keyIndex]);
                } else {
                    throw new Error("All API keys are exhausted.");
                }
            }
            return await response.json();
        };
        const data = await fetchWithKey(keys[keyIndex]);

        if (data.items && data.items.length > 0) {
            liveChannelId = data.items[0].id.channelId;
            // print channel id to console
            console.log("Channel ID:", liveChannelId);
            // Get Channel Name and Image from api
            const channelName = data.items[0].snippet.title;
            // check if channel has high resolution image if not use medium if not use default
            const channelImage = data.items[0].snippet.thumbnails.high
                ? data.items[0].snippet.thumbnails.high.url
                : data.items[0].snippet.thumbnails.medium
                    ? data.items[0].snippet.thumbnails.medium.url
                    : data.items[0].snippet.thumbnails.default.url;
            // print channel name and image to console
            // store this console log in a variable
            console.log("Channel Name:", channelName, "Channel Image:", channelImage);

            // listen to subscribe button click
            document.getElementById("sub-button").addEventListener("click", function () {
                window.open("https://www.youtube.com/channel/" + liveChannelId, "_blank");
            });
            // Set Channel Name and Image
            document.getElementById("channelName").textContent = channelName;
            document.getElementById("YTchannelImage").src = channelImage;
            // call fetchAllStatistics function with liveChannelId
            fetchAllStatistics(liveChannelId);
        } else {
            // raise alert if channel not found
            alert("Channel not found.");
        }
    } catch (error) {
        console.error("Error fetching channel ID:", error);
        // raise alert Error fetching data
        alert("Error fetching data for channel ID: " + $, { liveChannelId } + ". Please try again.");
    }
}

// Function to fetch subscriber count from YouTube API
async function fetchYouTubeStatistics(channelId) {
    try {
        const youtubeUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`;
        const youtubeResponse = await fetch(youtubeUrl);
        const youtubeData = await youtubeResponse.json();
        if (youtubeData.items && youtubeData.items.length > 0) {
            apiSubCount = parseInt(youtubeData.items[0].statistics.subscriberCount, 10);
        }

    } catch (error) {
        console.error("Error fetching YouTube statistics:", error);
        alert("Error fetching YouTube statistics.");
    }
}

// Function to fetch subscriber count and other data from SocialCounts API
async function fetchSocialCounts(channelId) {
    try {
        const socialCountsUrl = `https://api.socialcounts.org/youtube-live-subscriber-count/${channelId}`;
        const socialResponse = await fetch(socialCountsUrl);
        const socialData = await socialResponse.json();

        estSubCount = socialData.est_sub;
        channelViews = socialData.table?.find(item => item.name === "Channel Views")?.count || 0;
        videoCount = socialData.table?.find(item => item.name === "Videos")?.count || 0;

    } catch (error) {
        console.error("Error fetching SocialCounts data:", error);
        alert("Error fetching SocialCounts data.");
    }
}


// Function to fetch all statistics (YouTube and SocialCounts)
async function fetchAllStatistics(channelId) {
    if (intervalId) clearInterval(intervalId);

    await fetchYouTubeStatistics(channelId);
    await fetchSocialCounts(channelId);

    // Initialize current count within the range
    currentSubCount = estSubCount;

    // Start the live counter
    startLiveCounter();
    updateOdometers(currentSubCount, channelViews, videoCount);
    // call madAlert function

}

function updateOdometers(subscribers, views, videos) {
    if (SubOdometer && subscribers !== undefined) {
        SubOdometer.innerHTML = subscribers;
    }
    if (ViewOdometer && views !== undefined) {
        ViewOdometer.innerHTML = views || channelViews; // Use existing value if views is invalid
    }
    if (VideoOdometer && videos !== undefined) {
        VideoOdometer.innerHTML = videos || videoCount; // Use existing value if videos is invalid
    }
}



function startLiveCounter() {
    if (!estSubCount || !apiSubCount) return;

    clearInterval(intervalId);
    intervalId = setInterval(() => {
        // Increment or decrement randomly within the range
        const rangeMin = Math.min(estSubCount, apiSubCount);
        const rangeMax = Math.max(estSubCount, apiSubCount);

        // Simulate a random fluctuation within the range
        const randomStep = Math.floor(Math.random() * 3) + 1; // Random step between 1 and 3
        if (currentSubCount < rangeMax) {
            currentSubCount += randomStep;
        } else if (currentSubCount > rangeMin) {
            currentSubCount -= randomStep;
        }
        // raise alert subscriber count and views count and video count
        console.log(`Subscribers: ${currentSubCount}, Views: ${channelViews}, Videos: ${videoCount}`);
        // Update the odometers
        updateOdometers(currentSubCount, channelViews, videoCount);
        // fetch social counts every 10 seconds
        fetchSocialCounts(liveChannelId);

    }, 10000); // Update every 10 seconds
}