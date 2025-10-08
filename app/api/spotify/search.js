// Spotify Search API Route
import { getValidAccessToken } from "./accesstoken/spotifyroute";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const type = searchParams.get("type") || "track";
  
  if (!q) {
    return new Response(JSON.stringify({ error: "Missing search query" }), { status: 400 });
  }
  
  try {
    // Get auth token from request header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), { status: 401 });
    }
    
    const authToken = authHeader.replace("Bearer ", "");
    const accessToken = await getValidAccessToken(authToken);
    
    const res = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=${type}`, {
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
