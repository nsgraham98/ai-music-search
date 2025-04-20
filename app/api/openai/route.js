// Current work flow:
// 1. From the searchbar component, user sends a request to the OpenAI API (this file) with a prompt
// 2. Using OpenAI function calling, we make our initial call to OpenAI with the user's prompt
// 3. OpenAI returns args to use to call the Jamendo API
// 4. The Jamendo API is called with the args from OpenAI (searchJamendo(args))
// 5. The entire Response (header + results) from the Jamendo API are returned to OpenAI
// 6. OpenAI adds those results to the conversation history (input.push())
// 7. We create one more response to OpenAI with the entire conversation history (input) and the tools (searchJamendo)
// 8. OpenAI returns its final response
// 9. We can do something with the data returned earlier from the Jamendo API (result.results)
// 10. We return the final response from OpenAI to the client
import OpenAI from "openai";
import { searchJamendo } from "./search-funcs.js";
import { getTools } from "./tools.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const userPrompt = await request.json();
    const tools = await getTools(); // load the tools from the tools.js file
    const input = [
      {
        role: "user",
        content: userPrompt.userQuery,
      },
    ];

    // Send the prompt to OpenAI API
    const response = await openai.responses.create({
      model: "gpt-4o",
      input,
      tools,
      tool_choice: { type: "function", name: "searchJamendo" },
    });

    // perform the tool call (searchJamendo) with the arguments from the response
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

    // newResponse.jamendoResults = result.results; // add the results to the response object
    console.log("OpenAI Final Response: ", newResponse);
    console.log("Jamendo Results: ", result.results);

    return new Response(
      JSON.stringify({
        output_text: newResponse.output_text,
        jamendoResults: result.results,
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
