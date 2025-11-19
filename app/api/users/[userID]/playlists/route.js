/* 
Route for handling getting and creating user playlists
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
import { authenticateCookie } from "@/lib/authenticate-calls";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { dbAdmin, admin } from "@/lib/firebase-admin.js";
import axios from "axios";

// This route is for getting all user playlists and creating a new playlist, not for operations on a specific playlist by ID
// We only need GET and POST methods here - no need for PATCH or DELETE

// Get all user playlists
// Call using axios example:
// await axios.get(`/api/users/${userID}/playlists`)
export async function GET(request, { params }) {
  try {
    const { userID } = await params;
    // const decodedToken = await authenticateCookie(request);
    // const uid = decodedToken.uid;

    const playlistsRef = dbAdmin
      .collection("playlists")
      .where("userID", "==", userID);
    const snap = await playlistsRef.get();
    if (snap.empty) {
      return Response.json({ playlists: [] }, { status: 200 });
    }
    const playlists = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    // const getQuery = query(
    //   collection(db, "playlists"),
    //   where("userID", "==", uid)
    // );
    // const snap = await getDocs(getQuery); // snap = read only collection of documents
    // // map through documents to load playlists into an array
    // const playlists = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("🎶 ", playlists.length, "playlist(s) found");

    // return successful response to client
    return new Response(
      JSON.stringify({
        playlists: playlists,
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

    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Other Error" }), {
      status: 500,
    });
  }
}

// Create a new playlist
// returns the new playlist object
// Call using axios example:
// await axios.post(`/api/users/${userID}/playlists`, { name: "New Playlist" })
export async function POST(request) {
  try {
    const body = await request.json();
    const playlistName = body.name;
    const description = body.description || "";
    const isPublic = body.public || false;
    const decodedToken = await authenticateCookie(request);

    const uid = decodedToken.uid;

    // Create new playlist document in Firestore
    const playlistCollectionRef = dbAdmin.collection("playlists");
    const newPlaylistRef = await playlistCollectionRef.add({
      name: playlistName,
      description: description,
      userID: uid,
      timeCreated: admin.firestore.FieldValue.serverTimestamp(),
      timeUpdated: admin.firestore.FieldValue.serverTimestamp(),
      public: isPublic,
      tracks: [],
    });

    // Update user's profile to include this new playlist
    const url = new URL(request.url);
    const origin = url.origin;
    const cookie = request.headers.get("cookie") ?? ""; // get cookies to pass for authentication (doesn't happen automatically on server-side fetch)
    // Make a PATCH request to update the user's profile route with the new playlist
    await axios.patch(
      `${origin}/api/users`,
      {
        playlists: { [newPlaylistRef.id]: playlistName },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie,
        },
      }
    );
    const newPlaylistSnap = await newPlaylistRef.get();
    const newPlaylistData = newPlaylistSnap.data();

    console.log("🎶 New playlist created:", newPlaylistRef.id);
    return new Response(
      JSON.stringify({
        id: newPlaylistRef.id,
        ...newPlaylistData,
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

    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Other Error" }), {
      status: 500,
    });
  }
}
