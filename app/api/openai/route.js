import OpenAI from "openai";
import { runOpenAISearch } from "@/services/openai.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const userPrompt = await request.json();
    const result = await runOpenAISearch(userPrompt.userQuery);

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
    console.error("Error fetching OpenAI:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
