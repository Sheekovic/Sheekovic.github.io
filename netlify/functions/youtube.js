import fetch from "node-fetch";

const allowedOrigins = new Set([
  "https://sheekovic.github.io",
  "https://sheekovic.netlify.app"
]);

function response(statusCode, body, origin) {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": statusCode < 400 ? "public, max-age=60, s-maxage=300" : "no-store",
    Vary: "Origin"
  };

  if (allowedOrigins.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "GET, OPTIONS";
  }

  return { statusCode, headers, body: JSON.stringify(body) };
}

function getKeys() {
  return [1, 2, 3, 4]
    .map((number) => process.env[`YOUTUBE_API_KEY_${number}`])
    .filter(Boolean);
}

async function fetchWithRotatingKey(params, keys) {
  const { resource, ...queryParams } = params;

  for (const key of keys) {
    const query = new URLSearchParams({ ...queryParams, key });
    const upstream = await fetch(`https://www.googleapis.com/youtube/v3/${resource}?${query}`);
    const data = await upstream.json();

    if (upstream.ok) return { status: 200, data };
    if (upstream.status !== 403 && upstream.status !== 429) {
      return { status: upstream.status, data };
    }
  }

  return { status: 503, data: { error: "YouTube API quota is unavailable." } };
}

export const handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || "";
  if (!allowedOrigins.has(origin)) return response(403, { error: "Origin not allowed." }, origin);
  if (event.httpMethod === "OPTIONS") return response(204, {}, origin);
  if (event.httpMethod !== "GET") return response(405, { error: "Method not allowed." }, origin);

  const keys = getKeys();
  if (keys.length === 0) return response(503, { error: "YouTube API is not configured." }, origin);

  const action = event.queryStringParameters?.action;
  let params;

  if (action === "search") {
    const query = event.queryStringParameters?.q?.trim();
    if (!query || query.length > 100) return response(400, { error: "Invalid channel query." }, origin);
    params = { resource: "search", part: "snippet", type: "channel", maxResults: "1", q: query };
  } else if (action === "statistics") {
    const channelId = event.queryStringParameters?.id?.trim();
    if (!channelId || !/^[A-Za-z0-9_-]{10,64}$/.test(channelId)) {
      return response(400, { error: "Invalid channel ID." }, origin);
    }
    params = { resource: "channels", part: "statistics", id: channelId };
  } else {
    return response(400, { error: "Unknown action." }, origin);
  }

  try {
    const upstream = await fetchWithRotatingKey(params, keys);
    return response(upstream.status, upstream.data, origin);
  } catch (error) {
    console.error("YouTube proxy failed:", error.message);
    return response(502, { error: "Unable to reach YouTube." }, origin);
  }
};
