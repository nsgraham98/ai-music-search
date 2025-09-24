// Spotify Playlist API Route
import { getSpotifyAccessToken } from "./spotifyhandler/tracks";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing playlist id" }), { status: 400 });
  }
  const accessToken = await getSpotifyAccessToken();
  const res = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await res.json();
  return new Response(JSON.stringify(data), { status: res.status });
}
