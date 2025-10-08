// API route to handle Spotify token exchange
import { getToken } from "../accesstoken/spotifyroute";

export async function POST(req) {
  try {
    const { code } = await req.json();
    
    // Get auth token from request header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), { status: 401 });
    }
    
    const authToken = authHeader.replace("Bearer ", "");
    const accessToken = await getToken(code, authToken);
    
    return new Response(JSON.stringify({ 
      success: true,
      message: "Spotify connected successfully" 
    }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    
  } catch (error) {
    console.error("Token exchange error:", error);
    return new Response(JSON.stringify({ 
      error: error.message || "Token exchange failed" 
    }), { status: 500 });
  }
}