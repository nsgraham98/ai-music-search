import { BsArrowDown } from "react-icons/bs";
import { getSongsJamendo } from "./get-songs-jamendo.js";

export async function GET(request) {
  try {
    const clientId = process.env.JAMENDO_CLIENT_ID; // Get the client ID from environment variables

    const { searchParams } = new URL(request.url); // Get the search params from the request URL
    const data = await getSongsJamendo(searchParams); // Call the Jamendo API with the search params

    // const searchParamsString = searchParams.toString(); // Convert the URL object to a string

    // const response = await fetch(
    //   `https://api.jamendo.com/v3.0/tracks/?${searchParamsString}`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    // if (!response.ok) {
    //   console.error("API Error:", response.statusText);
    //   return;
    // }
    // const data = await response.json(); // Parse the response as JSON
    console.log("Jamendo data:", data); // Log the data for debugging
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
