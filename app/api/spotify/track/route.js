// app/api/spotify/track/route.js
import { getValidAccessToken } from "../accesstoken/spotifyroute";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing track id" }), { status: 400 });
  }

  try {
    // Get auth token from request header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), { status: 401 });
    }
    
    const authToken = authHeader.replace("Bearer ", "");
    const accessToken = await getValidAccessToken(authToken);
    
    const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status });
  } catch (error) {
    console.error("Spotify track fetch error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 401 });
  }
}