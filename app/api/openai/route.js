// API route to handle OpenAI requests
// should be changed in the future to send request to pages/api/openAI.js (backend)
import OpenAI from "openai";
import { readFileSync } from "fs";
import path from "path";
import { searchJamendo } from "./search-funcs.js";
import { tools } from "./tools.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    // Parse the incoming request body as JSON
    const prompt = await request.json();
    console.log("Prompt: ", prompt);
    // Send the prompt to OpenAI API
    const response = await openai.responses.create({
      model: "gpt-4o",
      input: [{ role: "user", content: prompt.userQuery }],
      tools,
      tool_choice: { type: "function", name: "searchJamendo" },
    });

    console.log("Response: ", response.output);

    // perform the tool call (searchJamendo) with the arguments from the response
    const toolCall = response.output[0];
    const args = JSON.parse(toolCall.arguments);
    const data = await searchJamendo(args);

    // console.log("Response: ", data.choices?.[0]?.message?.content);

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

// export async function POST(request) {
//   try {
//     // Parse the incoming request body as JSON
//     const prompt = await request.json();

//     // Send the prompt to OpenAI API
//     const response = await fetch("https://api.openai.com/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//       },
//       body: JSON.stringify({
//         model: "gpt-4o-mini",
//         messages: [
//           {
//             role: "user",
//             content: `Here is a JSON list of songs:\n\n${jsonText}\n\n return all song names+artists for this query: ${prompt.query}`, // ~3000 tokens for 314 line json file: 12 songs
//           },
//         ],
//       }),
//     });

//     // Parse the OpenAI response
//     const data = await response.json();

//     // You can now handle or log the OpenAI response data
//     console.log("Data: ", data);
//     console.log("Response: ", data.choices?.[0]?.message?.content);

//     return new Response(JSON.stringify(data), {
//       status: 200,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching OpenAI:", error);
//     return new Response(JSON.stringify({ error: "Something went wrong" }), {
//       status: 500,
//     });
//   }
// }
