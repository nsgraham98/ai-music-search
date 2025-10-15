// Workflow for the search process:
// 1. From the searchbar component, user sends a request to the app/api/openai/route.js
// 2. Authorize the user using Firebase token
// 3. Route.js calls runOpenAISearch() in this file (openai.js)
// 4. Using OpenAI function calling, we make our initial call to OpenAI with the user's prompt
// 5. OpenAI returns args to use to call the Jamendo or Spotify API
// 6. The API is called with the args from OpenAI (searchJamendo(args) or searchSpotify(args))
// 7. The entire Response (header + results) from the API are returned to OpenAI
// 8. OpenAI adds those results to the conversation history (input.push())
// 9. We create one more response to OpenAI with the entire conversation history (input) and the tool call
// 10. OpenAI returns its final response
// 11. We can do something with the data returned earlier from the API (result.results)
// 12. We return the final response from OpenAI to the client

import OpenAI from "openai";
import { searchJamendo } from "@/app/api/jamendo/jamendo-search.js";
import { searchSpotify } from "@/app/api/spotify/spotifyhandler/spotify-search-helper.js";
import { getTools } from "@/lib/ai-tools.js";
import { getSpotifyTools } from "@/lib/ai-tools.js";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_SECRET_KEY,
});

// Main function to handle the OpenAI search workflow
// uses OpenAI "function calling": https://platform.openai.com/docs/guides/function-calling#page-top
// Now supports both Jamendo and Spotify searches
export async function runOpenAISearch(userQuery, musicService = "jamendo", authToken = null) {
  try {
    const tools = await getTools(); // load the tools (available search tags, etc.) from the tools.js file

    // Determine which tool to use based on musicService
    const toolName = musicService === "spotify" ? "searchSpotify" : "searchJamendo";
    
    // input is the conversation history
    // Only one message (the user's initial query) and role are included right now
    const input = [
      {
        role: "user",
        content: userQuery,
      },
    ];

    // Send the prompt to OpenAI API
    console.log(`🧠 Starting OpenAI search for ${musicService}`);
    const response = await openai.responses.create({
      model: "gpt-4o",
      input,
      tools,
      tool_choice: { type: "function", name: toolName },
    });

    // perform the tool call with the arguments from the response
    // "tool call" refers to the structured way an OpenAI model tells our code "I want you to run this function with these arguments."
    const toolCall = response.output[0];
    const args = JSON.parse(toolCall.arguments);
    console.log(`🧠 Response from OpenAI received. (${musicService} search args)`);
    
    // Call the appropriate search function based on the music service
    let result;
    if (musicService === "spotify") {
      if (!authToken) {
        throw new Error("Auth token required for Spotify search");
      }
      result = await searchSpotify(args, authToken);
    } else {
      result = await searchJamendo(args);
    }

    // append model's function call message
    input.push(toolCall);
    input.push({
      type: "function_call_output",
      call_id: toolCall.call_id,
      output: JSON.stringify(result),
    });

    // Send the tool call result back to OpenAI API for final response
    console.log(`🧠 Sending ${musicService} results back to OpenAI for final response`);
    const newResponse = await openai.responses.create({
      model: "gpt-4o",
      input,
      tools,
      store: true,
    });
    console.log("🧠 Final response from OpenAI received");
    
    // Return results in a consistent format
    return {
      aiResponse: newResponse,
      musicService: musicService,
      results: musicService === "spotify" ? result.results : result.results,
    };
  } catch (error) {
    console.error("Error fetching OpenAI:", error);
    throw error;
  }
}

export async function runSpotifySearch(userQuery) {
  try {
    const tools = await getSpotifyTools();

    const input = [
      {
        role: "user",
        content: userQuery,
      },
    ];

    //prompt to openai
    const response = await openai.responses.create({
      model: "gpt-4o",
      input,
      tools,
      tool_choice: { type: "function", name: "searchSpotify" },
    });

    const toolCall = response.output[0];
    const args = JSON.parse(toolCall.arguments);

    //call search and store result
    const result = await searchSpotify(args, authToken);

    input.push(toolCall);
    input.push({
      type: "function_call_output",
      call_id: toolCall.call_id,
      output: result.toString(),
    });

    const newResponse = await openai.responses.create({
      model: "gpt-4o",
      input,
      tools,
      store: true,
    });
    return {
      aiResponse: newResponse,
      spotifyResponse: result.results,
    };
  } catch (error) {
    console.error("Error fetching OpenAI:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    })

  }
}

async function searchSpotify(search, authToken) { //api call
  const response = await fetch('https://api.spotify.com/v1/search', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify(search),
  });

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.statusText}`);
  }

  return await response.json();
}
