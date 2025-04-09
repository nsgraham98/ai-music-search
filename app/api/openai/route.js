// API route to handle OpenAI requests
// should be changed in the future to send request to pages/api/openAI.js (backend)
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
            content: prompt.query, // Your prompt
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
