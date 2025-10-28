/*
  API Route to handle operations on a specific playlist by ID
  Including: getting, updating (name, description, public/private, etc.), and deleting a specific playlist by ID.
*/

import {
  authenticateCookie,
  authenticateIdToken,
} from "@/lib/authenticate-calls";
import {
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
  documentId,
} from "firebase/firestore";
// Get a specific playlist by ID
// Call using axios example:
// await axios.get(/api/playlists/{playlistID})
export async function GET(request, { params }) {
  try {
    const { playlistID } = params;
    const decodedToken = await authenticateCookie(request);
    const uid = decodedToken.uid;

    const getQuery = query(
      collection(db, "playlists"),
      where(documentId(), "==", playlistID),
      where("userID", "==", uid)
    );
    const snap = await getDocs(getQuery); // snap = read only collection of documents
    const playlist = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))[0]; // there should only be one playlist with this ID
    console.log("Playlist: ", playlist);
    /*
      playlistEntry = {
        id: string (document ID),
        name: string (playlist name),
        description: string (playlist description),
        public: boolean (is playlist public?),
        userID: string (owner's user ID),
        createdAt: Date (creation timestamp),
        updatedAt: Date (last updated timestamp),
        tracks: Array<track_id> (IDs of tracks in the playlist),
      }
    */

    // const uid = decodedToken.uid;
    // someGetPlaylistByIDFunction(playlistID, uid)
    // return successful response to client
    return new Response(
      JSON.stringify({
        playlist: playlist,
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

// Update a specific playlist by ID (change name, description, public/private, etc.)
// Call using axios example:
// await axios.patch(/api/playlists/{playlistID}, { name: "New Playlist Name", description: "New Description", public: true })
export async function PATCH(request, { params }) {
  try {
    const { playlistID } = params;
    const body = await request.json();
    const { name, description, isPublic } = body;

    const decodedToken = await authenticateCookie(request);
    const uid = decodedToken.uid;

    // create a payload with only the fields that are defined, to avoid overwriting with undefined
    const payload = {};
    if (name !== undefined) payload.name = name;
    if (description !== undefined) payload.description = description;
    if (isPublic !== undefined) payload.public = isPublic;
    payload.timeUpdated = serverTimestamp();

    const playlistRef = await db.collection("playlists").doc(playlistID);
    if (playlistRef.userID !== uid) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    await playlistRef.set(
      {
        ...payload,
      },
      { merge: true }
    );

    // someUpdatePlaylistByIDFunction(playlistID, uid, body)
    // return successful response to client
    return new Response(
      JSON.stringify({
        ok: true,
        playlist: { id: playlistID, ...payload },
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
// Call using axios example:
// await axios.delete(/api/playlists/{playlistID})
export async function DELETE(request, { params }) {
  try {
    const { playlistID } = params;
    const decodedToken = await authenticateCookie(request);
    const uid = decodedToken.uid;

    const playlistRef = await db.collection("playlists").doc(playlistID);
    if (playlistRef.userID !== uid) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    await playlistRef.delete();
    // return successful response to client
    return new Response(
      JSON.stringify({
        ok: true,
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
