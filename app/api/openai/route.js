// This is the first API route that is called from the client (searchbar component)
// It authenticates the user, then calls runOpenAISearch() in openai.js to handle the rest of the flow
// Then it returns the final response to the client
// Now supports both Jamendo and Spotify music services

import OpenAI from "openai";
import { runOpenAISearch } from "@/app/api/openai/openai-handler/openai.js";
import {
  authenticateIdToken,
  authenticateCookie,
} from "@/lib/authenticate-calls";
import { runSpotifySearch } from "@/app/api/openai/openai-handler/openai.js"; // need to toggle royaltyFree TODO; royalty free logic

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_SECRET_KEY,
});

export async function POST(request) {
  try {
    // Authenticate the user using Firebase token
    const decodedToken = await authenticateCookie(request); // we don't use the result, but it will throw an error if invalid

    console.log("🧠 Starting OpenAI search");
    const body = await request.json();
    const { userQuery, musicService = "jamendo" } = body;
    
    // Get auth token for Spotify if needed
    let authToken = null;
    if (musicService === "spotify") {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        authToken = authHeader.substring(7);
      }
    }
    
    // main function to handle the OpenAI search logic
    const result = await runOpenAISearch(userQuery, musicService, authToken);

    // return successful response to client
    return new Response(
      JSON.stringify({
        aiResponse: result.aiResponse,
        musicService: result.musicService,
        results: result.results,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    if (error.name === "FirebaseAuthError") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    console.error("OpenAI error:", error);
    return new Response(JSON.stringify({ error: "OpenAI processing failed" }), {
      status: 500,
    });
  }
}
