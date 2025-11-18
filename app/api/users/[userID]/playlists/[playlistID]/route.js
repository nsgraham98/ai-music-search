/*
  API Route to handle operations on a specific playlist by ID
  Including: getting, updating (name, description, public/private, etc.), and deleting a specific playlist by ID.
*/

import { authenticateCookie } from "@/lib/authenticate-calls";
import { dbAdmin, adminAuth, admin } from "@/lib/firebase-admin.js";
// Get a specific playlist by ID
// Call using axios example:
// await axios.get(`/api/users/${userID}/playlists/${playlistID}`)
// currently only the owner can get their playlist by ID
export async function GET(request, { params }) {
  try {
    const { playlistID, userID } = await params;
    // const decodedToken = await authenticateCookie(request);
    // const uid = decodedToken.uid;

    const docRef = dbAdmin.collection("playlists").doc(playlistID);
    const snap = await docRef.get();
    if (!snap.exists) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });
    }

    // ownership / access check
    if (snap.get("userID") !== userID) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const playlist = { id: snap.id, ...snap.data() };
    // const getQuery = query(
    //   collection(db, "playlists"),
    //   where(documentId(), "==", playlistID),
    //   where("userID", "==", uid)
    // );
    // const snap = await getDocs(getQuery); // snap = read only collection of documents
    // const playlist = snap.docs.map((doc) => ({
    //   id: doc.id,
    //   ...doc.data(),
    // }))[0]; // there should only be one playlist with this ID

    console.log("🎶 Playlist: ", playlist);
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
// await axios.patch(`/api/users/${userID}/playlists/${playlistID}`, { name: "New Playlist Name", description: "New Description", public: true })
export async function PATCH(request, { params }) {
  try {
    const { playlistID } = await params;
    const body = await request.json();
    const { name, description, isPublic } = body;

    const decodedToken = await authenticateCookie(request);
    const uid = decodedToken.uid;

    console.log("PATCH payload:", body);

    // create a payload with only the fields that are defined, to avoid overwriting with undefined
    const payload = {};
    if (name !== undefined) payload.name = name;
    if (description !== undefined) payload.description = description;
    if (isPublic !== undefined) payload.public = isPublic;
    payload.timeUpdated = admin.firestore.FieldValue.serverTimestamp();

    const playlistRef = dbAdmin.collection("playlists").doc(playlistID);
    const playlistSnap = await playlistRef.get();

    const userProfileRef = dbAdmin.collection("users").doc(uid);
    const userProfileSnap = await userProfileRef.get();

    if (!playlistSnap.exists || !userProfileSnap.exists) {
      return new Response(JSON.stringify({ error: "Playlist not found" }), {
        status: 404,
      });
    }
    if (playlistSnap.get("userID") !== uid) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }
    await playlistRef.set(payload, { merge: true });
    await userProfileRef.set(
      {
        [`playlists.${playlistID}`]: payload.name,
      },
      { merge: true }
    );
    // const playlistRef = doc(db, "playlists", playlistID); // ✅ modular doc() helper
    // const playlistSnap = await getDoc(playlistRef);
    // if (!playlistSnap.exists()) {
    //   return new Response(JSON.stringify({ error: "Playlist not found" }), {
    //     status: 404,
    //   });
    // }
    // if (playlistSnap.data().userID !== uid) {
    //   return new Response(JSON.stringify({ error: "Unauthorized" }), {
    //     status: 401,
    //   });
    // }

    // await setDoc(
    //   playlistRef,
    //   {
    //     ...payload,
    //   },
    //   { merge: true }
    // );

    console.log("🎶 Playlist updated:", playlistID, payload);
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
// await axios.delete(`/api/users/${userID}/playlists/${playlistID}`)
export async function DELETE(request, { params }) {
  try {
    const { playlistID } = await params;
    const decodedToken = await authenticateCookie(request);
    const uid = decodedToken.uid;

    // 1. get the playlist document
    const playlistRef = dbAdmin.collection("playlists").doc(playlistID);
    const playlistSnap = await playlistRef.get();
    // 2. get the user profile's reference to this playlist too
    const userProfileRef = dbAdmin.collection("users").doc(uid);
    const userProfileSnap = await userProfileRef.get();

    // 3. check if they exist
    if (!playlistSnap.exists || !userProfileSnap.exists) {
      return new Response(JSON.stringify({ error: "Playlist not found" }), {
        status: 404,
      });
    }
    if (playlistSnap.get("userID") !== uid) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // 4. delete both references
    await userProfileRef.update({
      [`playlists.${playlistID}`]: dbAdmin.firestore.FieldValue.delete(),
    });
    await playlistRef.delete();
    console.log("🎶 Playlist deleted:", playlistID);

    // TODO: add handling if one of the deletions fail?

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
