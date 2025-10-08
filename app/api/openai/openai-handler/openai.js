// Workflow for the search process:
// 1. From the searchbar component, user sends a request to the app/api/openai/route.js
// 2. Authorize the user using Firebase token
// 3. Route.js calls runOpenAISearch() in this file (openai.js)
// 4. Using OpenAI function calling, we make our initial call to OpenAI with the user's prompt
// 5. OpenAI returns args to use to call the Jamendo API
// 6. The Jamendo API is called with the args from OpenAI (searchJamendo(args))
// 7. The entire Response (header + results) from the Jamendo API are returned to OpenAI
// 8. OpenAI adds those results to the conversation history (input.push())
// 9. We create one more response to OpenAI with the entire conversation history (input) and the tool call (searchJamendo)
// 10. OpenAI returns its final response
// 11. We can do something with the data returned earlier from the Jamendo API (result.results)
// 12. We return the final response from OpenAI to the client

import OpenAI from "openai";
import { searchJamendo } from "@/app/api/jamendo/jamendo-search.js";
import { getTools } from "@/lib/ai-tools.js";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Main function to handle the OpenAI search workflow
// uses OpenAI "function calling": https://platform.openai.com/docs/guides/function-calling#page-top
export async function runOpenAISearch(userQuery) {
  try {
    const tools = await getTools(); // load the tools (available search tags, etc.) from the tools.js file

    // input is the conversation history
    // Only one message (the user's initial query) and role are included right now
    const input = [
      {
        role: "user",
        content: userQuery,
      },
    ];

    // Send the prompt to OpenAI API
    const response = await openai.responses.create({
      model: "gpt-4o",
      input,
      tools,
      tool_choice: { type: "function", name: "searchJamendo" },
    });

    // perform the tool call with the arguments from the response
    // “tool call” refers to the structured way an OpenAI model tells our code “I want you to run this function (searchJamendo(args)) with these arguments.”
    // can make this more elaborate later if needed - eg. more than one tool call
    const toolCall = response.output[0];
    const args = JSON.parse(toolCall.arguments);
    const result = await searchJamendo(args);

    // append model's function call message
    input.push(toolCall);
    input.push({
      type: "function_call_output",
      call_id: toolCall.call_id,
      output: result.toString(),
    });

    // Send the tool call result back to OpenAI API for final response
    const newResponse = await openai.responses.create({
      model: "gpt-4o",
      input,
      tools,
      store: true,
    });
    return {
      aiResponse: newResponse,
      jamendoResponse: result.results,
    };
  } catch (error) {
    console.error("Error fetching OpenAI:", error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}
