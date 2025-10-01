/*
Route for getting and performing CRUD operations on a specific playlist by ID
===========================================================
General notes:
Playlists will be stored in firestore, under:
    users/{uid}/playlists/{playlistID}
Each playlist document will contain:
    name: string
    description: string
    tracks: array of trackIDs (from Jamendo API)
    created_at: timestamp
    updated_at: timestamp
    public: boolean (false by default)
Maximizing storage efficiency is a large consideration - by not storing full track data. 
    Especially consider not storing waveform data.
We can fetch the full track data from Jamendo API when needed, and store it client-side for the session
    on my medium-high end machine, chatgpt says we can store:
        ~10k tracks (without waveform data)
        ~750 tracks (with waveform data)
        note: jamendo only returns max 200 tracks per request, so we can paginate requests in the future, once this we get this working
    check this using chrome devtools memory tab -> Total JS heap size
        mine is ~160MB, ~20 kB/sec
*/

import { authenticateAPICall } from "@/lib/authenticate-calls";

// Get a specific playlist by ID
export async function GET(request, { params }) {
  try {
    const { playlistID } = params;
    const decodedToken = await authenticateAPICall(request);
    const uid = decodedToken.uid;
    // someGetPlaylistByIDFunction(playlistID, uid)
    // return successful response to client
    return new Response(
      JSON.stringify({
        // some response data
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
    console.error("GET playlist error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to retrieve playlist" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Update a specific playlist by ID
export async function PATCH(request, { params }) {
  try {
    const { playlistID } = params;
    const decodedToken = await authenticateAPICall(request);
    const uid = decodedToken.uid;
    const body = await request.json();

    // someUpdatePlaylistByIDFunction(playlistID, uid, body)
    // return successful response to client
    return new Response(
      JSON.stringify({
        // some response data
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
    console.error("PATCH playlist error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update playlist" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Delete a specific playlist by ID
export async function DELETE(request, { params }) {
  try {
    const { playlistID } = params;
    const decodedToken = await authenticateAPICall(request);
    const uid = decodedToken.uid;
    // someDeletePlaylistByIDFunction(playlistID, uid)
    // return successful response to client
    return new Response(
      JSON.stringify({
        // some response data
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
    console.error("DELETE playlist error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete playlist" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
