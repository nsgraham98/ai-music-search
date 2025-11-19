// Spotify Playlist API Route
import { checkAccessToken } from "./accesstoken/spotifyroute";

export async function getPlaylist(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing playlist id" }), { status: 400 });
  }

  try {
    // Get auth token from request header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), { status: 401 });
    }
    
    const authToken = authHeader.replace("Bearer ", "");
    const accessToken = await checkAccessToken(authToken);
    
    const res = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 401 });
  }
}
