// Spotify search helper function for OpenAI integration
import { getValidAccessToken } from "../accesstoken/spotifyroute.js";

export async function searchSpotify(searchArgs, authToken) {
    try {
        // Get valid access token for the user
        const accessToken = await getValidAccessToken(authToken);
        
        // Build Spotify search query
        const searchQuery = encodeURIComponent(searchArgs.q);
        const type = searchArgs.type || 'track';
        const limit = searchArgs.limit || 20;
        
        // Call Spotify Web API
        const response = await fetch(
            `https://api.spotify.com/v1/search?q=${searchQuery}&type=${type}&limit=${limit}`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        
        if (!response.ok) {
            throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Return in a format similar to Jamendo for consistency
        return {
            tracks: data.tracks,
            albums: data.albums,
            artists: data.artists,
            playlists: data.playlists,
            results: data.tracks?.items || [], // For compatibility
        };
        
    } catch (error) {
        console.error('Spotify search error:', error);
        throw new Error(`Failed to search Spotify: ${error.message}`);
    }
}