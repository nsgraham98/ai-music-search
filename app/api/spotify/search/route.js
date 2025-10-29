import { getValidAccessToken } from "../accesstoken/spotifyroute";

export async function POST(request) {
  try {
    const body = await request.json();
    const { queries, filters = {} } = body;
    const { limit = 20, market = "US" } = filters;
    
    // Handle both single query and queries array for flexibility
    let searchQueries = [];
    if (queries && Array.isArray(queries)) {
      searchQueries = queries;
    } else if (body.query) {
      searchQueries = [body.query]; // Single query fallback
    } else {
      return new Response(JSON.stringify({ error: "Missing search query or queries" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    // Get auth token
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    
    const authToken = authHeader.replace("Bearer ", "");
    const accessToken = await getValidAccessToken(authToken);
    
    let allTracks = [];
    
    // Search with each query and combine results
    for (const query of searchQueries) {
      const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}&market=${market}`;
      
      const response = await fetch(searchUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error(`Spotify API error for query "${query}":`, data.error);
        continue; // Skip this query and try the next one
      }
      
      // Transform and add tracks, avoiding duplicates
      if (data.tracks?.items) {
        const newTracks = data.tracks.items
          .filter(track => !allTracks.find(existing => existing.id === track.id))
          .map(track => ({
            id: track.id,
            name: track.name,
            artist_name: track.artists[0]?.name || 'Unknown Artist',
            album_name: track.album?.name || 'Unknown Album',
            duration: Math.floor(track.duration_ms / 1000),
            audio: track.preview_url,
            image: track.album?.images[0]?.url,
            shareurl: track.external_urls?.spotify,
            source: 'spotify'
          }));
        
        allTracks = [...allTracks, ...newTracks];
      }
    }
    
    // Limit total results
    const finalTracks = allTracks.slice(0, limit * 2);
    
    return new Response(JSON.stringify({ 
      results: finalTracks,
      totalFound: allTracks.length,
      queriesUsed: searchQueries
    }), {
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