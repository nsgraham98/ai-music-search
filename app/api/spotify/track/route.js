//Testing getting track by search
// Will be our main way to get tracks.

import { getValidAccessToken } from "../accesstoken/spotifyroute";


export async function getTrack () {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) {
        return new Response(JSON.stringify({ error: "Missing track id" }), { status: 400 });
    }

    try{
        const authHeader = req.headers.get("authorization");
        const accessToken = await getValidAccessToken(authHeader);
        if (!authHeader) {
            return new Response(JSON.stringify({ error: "No authorization header" }), { status: 401 });
        }
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