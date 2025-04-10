// API route to handle OpenAI requests
// should be changed in the future to send request to pages/api/openAI.js (backend)
import OpenAI from "openai";
import { readFileSync } from "fs";
import path from "path";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// temporary testing solution to read the testTracks.json file from the public directory
const filePath = path.join(
  process.cwd(),
  "public/assets/testTracks/testTracks.json"
);
const fileContent = readFileSync(filePath, "utf-8");
const jsonText = JSON.stringify(JSON.parse(fileContent));

export async function POST(request) {
  try {
    // Parse the incoming request body as JSON
    const prompt = await request.json();

    // Send the prompt to OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Here is a JSON list of songs:\n\n${jsonText}\n\n return all song names+artists for this query: ${prompt.query}`, // ~3000 tokens for 314 line json file: 12 songs
          },
        ],
      }),
    });

    // Parse the OpenAI response
    const data = await response.json();

    // You can now handle or log the OpenAI response data
    console.log("Data: ", data);
    console.log("Response: ", data.choices?.[0]?.message?.content);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching OpenAI:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
