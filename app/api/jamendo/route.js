import { BsArrowDown } from "react-icons/bs";

export async function GET(request) {
  try {
    const clientId = process.env.JAMENDO_CLIENT_ID; // Get the client ID from environment variables

    console.log("1.Jamendo API Route called"); // Log to check if the function is called
    console.log("2.Request URL: ", request.url); // Log the request URL for debugging
    const { searchParams } = new URL(request.url); // Get the search params from the request URL
    console.log("3.Search Params: ", searchParams); // Log the search params for debugging
    const searchParamsString = searchParams.toString(); // Convert the URL object to a string
    console.log("4.Search Params in URL: ", searchParamsString); // Log the URL for debugging
    console.log(
      "Full URL:",
      `https://api.jamendo.com/v3.0/tracks/?${searchParamsString}`
    );

    const response = await fetch(
      `https://api.jamendo.com/v3.0/tracks/?${searchParamsString}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.error("API Error:", response.statusText);
      return;
    }
    const data = await response.json(); // Parse the response as JSON
    console.log("5. Jamendo Response (in jamendo/route.js): ", data); // Log the response for debugging
    // console.log("5. Jamendo Response: ", response); // Log the response for debugging

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching Jamendo data:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch Jamendo data" }),
      {
        status: 500,
      }
    );
  }
}
