// Spotify Search API Route
import { getSpotifyAccessToken } from "./spotifyhandler/tracks";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const type = searchParams.get("type") || "track";
  if (!q) {
    return new Response(JSON.stringify({ error: "Missing search query" }), { status: 400 });
  }
  const accessToken = await getSpotifyAccessToken();
  const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=${type}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await res.json();
  return new Response(JSON.stringify(data), { status: res.status });
}
