// Helper function to search Spotify using existing API route
export async function searchSpotify(searchObj, authToken) {
  try {
    // Convert OpenAI search parameters to Spotify query format
    const query = createSpotifyQuery(searchObj);
    
    //Call our existing Spotify search API route
    const searchUrl = `http://localhost:3000/api/spotify/search?q=${encodeURIComponent(query)}&type=track&limit=20`;
    
    const response = await fetch(searchUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      console.error("Spotify API Error:", response.statusText);
      throw new Error(`Spotify API Error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Spotify search error:", error);
    throw error;
  }
}

//convert ppenai search parameters to spotify query format
function createSpotifyQuery(searchObj) {
  const parts = [];
  
  //Add track name if provided
  if (searchObj.track) {
    parts.push(searchObj.track);
  }
  
  //Add artist if provided
  if (searchObj.artist) {
    parts.push(`artist:${searchObj.artist}`);
  }
  
  //Add genre if provided
  if (searchObj.genre) {
    parts.push(`genre:${searchObj.genre}`);
  }
  
  //Add mood/tags as general search terms
  if (searchObj.tags && Array.isArray(searchObj.tags)) {
    parts.push(...searchObj.tags);
  }
  
  //If no specific parameters, use general search terms
  if (parts.length === 0 && searchObj.query) {
    parts.push(searchObj.query);
  }
  
  return parts.join(' ');
}