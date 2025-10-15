// Helper function to search Spotify using existing API route
// Similar to Jamendo's searchJamendo() function
// Gets called from the OpenAI handler with AI-generated search parameters
export async function searchSpotify(searchObj, authToken) {
  try {
    // Convert OpenAI search parameters to Spotify query format
    const query = createSpotifyQuery(searchObj);
    
    console.log(`🎵 Spotify search with query: "${query}"`);
    
    // Call our existing Spotify search API route (POST method)
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/spotify/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        query: query,
        type: "track",
        limit: 20,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Spotify API Error:", errorData);
      throw new Error(`Spotify API Error: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json();
    console.log("🎵 Spotify results received:", data.results?.length || 0, "tracks");
    
    return data;
  } catch (error) {
    console.error("Spotify search error:", error);
    throw error;
  }
}

// Convert OpenAI search parameters to Spotify query format
// Spotify search supports advanced query syntax:
// - artist:name - Search for artist
// - track:name - Search for track
// - genre:genre - Search for genre
// - year:YYYY - Search for year

function createSpotifyQuery(searchObj) {
  const parts = [];
  
  // Add track name if provided
  if (searchObj.track) {
    parts.push(`track:${searchObj.track}`);
  }
  
  // Add artist if provided
  if (searchObj.artist) {
    parts.push(`artist:${searchObj.artist}`);
  }
  
  // Add genre if provided (Spotify genre search)
  if (searchObj.genre) {
    parts.push(`genre:${searchObj.genre}`);
  }
  
  // Add mood/style tags as general search terms
  if (searchObj.tags && Array.isArray(searchObj.tags)) {
    parts.push(...searchObj.tags);
  }
  
  // If no specific parameters, use general search terms
  if (parts.length === 0 && searchObj.query) {
    parts.push(searchObj.query);
  }
  
  // Join with spaces - Spotify interprets this as AND logic
  return parts.join(' ');
}