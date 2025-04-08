// API route to handle OpenAI requests
export async function GET(request) {
  return new Response(JSON.stringify({ message: "Hello from OpenAI API!" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
