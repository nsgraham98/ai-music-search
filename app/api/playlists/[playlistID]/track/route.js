/* 
  API Route to handle operations on specific tracks in a playlist
  Including: adding and deleting tracks from a specific playlist by ID.
*/

import { authenticateCookie } from "@/lib/authenticate-calls";
import { db } from "@/lib/firebase.js";
import { serverTimestamp, arrayUnion, arrayRemove } from "firebase/firestore";

// Add a track to a specific playlist by ID
// Call using axios example:
// await axios.patch(/api/playlists/{playlistID}/track/{trackID})
export async function PATCH(request, { params }) {
  try {
    const { playlistID, trackID } = params;

    const decodedToken = await authenticateCookie(request);
    const uid = decodedToken.uid;

    const playlistRef = await db.collection("playlists").doc(playlistID);
    if (playlistRef.userID !== uid) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    await playlistRef.set(
      {
        tracks: arrayUnion(trackID), // add the trackID to the tracks array (create array if it doesn't exist, adds if no duplicate)
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    // return successful response to client
    return new Response(
      JSON.stringify({
        ok: true,
        playlist: { id: playlistID, tracks: arrayUnion(trackID) },
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

// Delete a track from a specific playlist by ID
// Call using axios example:
// await axios.delete(/api/playlists/{playlistID}/track/{trackID})
export async function DELETE(request, { params }) {
  try {
    const { playlistID, trackID } = params;
    const decodedToken = await authenticateCookie(request);
    const uid = decodedToken.uid;
    const playlistRef = await db.collection("playlists").doc(playlistID);
    if (playlistRef.userID !== uid) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    await playlistRef.set(
      {
        tracks: arrayRemove(trackID), // remove the trackID from the tracks array
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    // return successful response to client
    return new Response(
      JSON.stringify({
        ok: true,
        playlist: { id: playlistID, tracks: arrayRemove(trackID) },
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
