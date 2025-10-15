import { checkAccessToken } from "../accesstoken/spotifyroute";

export async function POST(request) {
  try {
    const body = await request.json();
    const {queries , filters = {} } = body;
    const {limit = 20, market = "US" } = filters; // headers in spotifytools (app/lib/ai-tools.js)
    
    if (!queries) {
      return new Response(JSON.stringify({ error: "Missing search query" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    //get auth token
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    const authToken = authHeader.replace("Bearer ", "");
    const accessToken = await checkAccessToken(authToken);
    
    let allTracks = []; //array to hold all tracks TODO:iterate through quries, change limits in filter of ai-tools.js
    
    const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`;
    
    const response = await fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Spotify API error: ${data.error?.message || 'Unknown error'}`);
    }
    
    // 

    const tracks = data.tracks?.items?.map(track => ({
      id: track.id,
      name: track.name,
      artist_name: track.artists[0]?.name || 'Unknown Artist',
      album_name: track.album?.name || 'Unknown Album',
      duration: Math.floor(track.duration_ms / 1000), // Convert to seconds
      audio: track.preview_url, // 30-second preview
      image: track.album?.images[0]?.url,
      shareurl: track.external_urls?.spotify,
      source: 'spotify'
    })) || [];
    
    return new Response(JSON.stringify({ results: tracks }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error('Spotify search error:', error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}