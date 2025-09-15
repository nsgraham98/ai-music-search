// This is the first API route that is called from the client (searchbar component)
// It authenticates the user, then calls runOpenAISearch() in openai.js to handle the rest of the flow
// Then it returns the final response to the client

import OpenAI from "openai";
import { runOpenAISearch } from "@/app/api/openai/openai-handler/openai.js";
import { authenticateAPICall } from "@/lib/authenticate-calls";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    // Authenticate the user using Firebase token
    // returns decoded token if valid, throws error if not
    const decodedToken = await authenticateAPICall(request); // We can use decodedToken to authorize the user if needed - e.g. check user ID, roles, etc. - but not implemented yet
    // const userId = decodedToken.uid; // you can log or use this if needed

    const body = await request.json();
    const result = await runOpenAISearch(body.userQuery); // main function to handle the OpenAI search logic

    console.log("AI Response:", result.aiResponse);
    console.log("Jamendo Response:", result.jamendoResponse);

    // return successful response to client
    return new Response(
      JSON.stringify({
        aiResponse: result.aiResponse,
        jamendoResponse: result.jamendoResponse,
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
