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
import { db } from "@/lib/firebase.js";
import { authenticateCookie } from "@/lib/authenticate-calls";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import axios from "axios";

// Get user playlists
export async function GET(request) {
  try {
    const body = await request.json();
    const decodedToken = await authenticateCookie(request);

    // const playlists = await someGetUserPlaylistsFunction();

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

    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Other Error" }), {
      status: 500,
    });
  }
}

// Create a new playlist
// returns the new playlist object
export async function POST(request) {
  try {
    const body = await request.json();
    const playlistName = body.name;
    const decodedToken = await authenticateCookie(request);

    const uid = decodedToken.uid;

    // Create new playlist document in Firestore
    const playlistCollectionRef = collection(db, "playlists");
    const newPlaylistRef = await addDoc(playlistCollectionRef, {
      name: playlistName,
      userID: uid,
      timeCreated: serverTimestamp(),
      timeUpdated: serverTimestamp(),
      public: false,
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

    return new Response(
      JSON.stringify({
        id: newPlaylistRef.id,
        name: playlistName,
        userID: uid,
        tracks: [],
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        public: false,
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
