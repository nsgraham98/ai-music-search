import OpenAI from "openai";
import { runOpenAISearch } from "@/app/api/openai/openai-handler/openai.js";
import { adminAuth } from "@/lib/firebase-admin";
import { authorizeAPICall } from "@/lib/authorize-calls";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const decodedToken = await authorizeAPICall(request);
    // const userId = decodedToken.uid; // you can log or use this if needed

    const body = await request.json();
    const result = await runOpenAISearch(body.userQuery);

    console.log("AI Response:", result.aiResponse);
    console.log("Jamendo Response:", result.jamendoResponse);

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
