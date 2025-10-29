// app/api/spotify/accesstoken/spotifyroute.js
import { adminAuth, db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// TODO: 
// Implement error handling 
// -- startspotifyauth needs to handle error case from api.

//Notes:
// Most of this implementation directly from spotify docs.
// uses pkce auth flow.
// This access token only lasts an hour.

// functions to save token in firestore (user).
async function saveSpotifyTokensToUser(uid, tokenData) {
  try {
    await db.collection("users").doc(uid).set(
      {
        spotify: {
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: tokenData.expires_at,
          code_verifier: tokenData.code_verifier,
          updated_at: Date.now(),
          connected: true,
        },
        lastUpdated: Date.now(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Failed to save Spotify tokens to user:', error);
    throw new Error('User token storage failed');
  }
}


async function getSpotifyTokensFromUser(uid) {
    try {
        const userDoc = await db.collection("users").doc(uid).get();

        if (!userDoc.exists) { //checks if user exists
            return null;
        }

        const userData = userDoc.data();
        const spotifyData = userData.spotify; //gets data from spotify field

        if (!spotifyData) { //checks if spotify data exists
            return null;
        }
        return {
            access_token: spotifyData.access_token,
            refresh_token: spotifyData.refresh_token,
            expires_at: spotifyData.expires_at,
            code_verifier: spotifyData.code_verifier,
            updated_at: spotifyData.updated_at,
            connected: spotifyData.connected
        };
    } catch (error) {
        console.error("Failed to retrieve spotify tokens", error);
        return null;
    }
}

// ===== SERVER-ONLY FUNCTIONS =====


// Exchange authorization code for access token (used by callback route)
export async function exchangeCodeForToken(code, authToken) {
    try {
        // Verify user authentication
        const decoded = await adminAuth.verifyIdToken(authToken);
        const uid = decoded.uid;
        
        // Get code verifier from user document (stored by init endpoint)
        const userDoc = await db.collection("users").doc(uid).get();
        if (!userDoc.exists) {
            throw new Error('User not found');
        }
        
        const userData = userDoc.data();
        const codeVerifier = userData.spotify_code_verifier;
        
        if (!codeVerifier) {
            throw new Error('Code verifier not found - please restart authentication');
        }

        // Exchange authorization code for tokens
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
                code_verifier: codeVerifier,
            }),
        });
        
        const data = await response.json();
        if (!response.ok || data.error) {
            throw new Error(`Spotify token exchange failed: ${data.error_description || 'Unknown error'}`);
        }
        
        // Save tokens to user document
        const tokenData = {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_at: Date.now() + (data.expires_in * 1000),
            code_verifier: codeVerifier,
        };
        await saveSpotifyTokensToUser(uid, tokenData);
        
        // Clean up the temporary code verifier
        await db.collection("users").doc(uid).update({
            spotify_code_verifier: FieldValue.delete()
        });
        
        return data.access_token;
    } catch(error) {
        console.error('Token exchange error:', error);
        throw error;
    }
}     

//refresh the access token
export async function refreshToken(authToken) {
    try {
        // Verify user authentication
        const decoded = await adminAuth.verifyIdToken(authToken);
        const uid = decoded.uid;
        
        // Get refresh token from session
        const tokens = await getSpotifyTokensFromUser(uid);
        const refreshTokenValue = tokens?.refresh_token;
        
        if (!refreshTokenValue) {
            throw new Error('No refresh token available');
        }
        
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
                grant_type: 'refresh_token',
                refresh_token: refreshTokenValue,
            }),
        });
        
        const data = await response.json();
        
        if (!response.ok || data.error) {
            throw new Error(`Token refresh failed: ${data.error_description || 'Unknown error'}`);
        }
        
        // Update stored tokens in session
        await saveSpotifyTokensToUser(uid, {
            access_token: data.access_token,
            refresh_token: data.refresh_token || refreshTokenValue,
            expires_at: Date.now() + (data.expires_in * 1000),
            code_verifier: tokens.code_verifier,
        });
        
        return data.access_token;
    } catch (error) {
        console.error('Token refresh error:', error);
        throw error;
    }
}

//checks if token is valid, then refrehes if needed. (token timeout)
export async function checkAccessToken(authToken) {
    try {
        //verify user
        const decoded = await adminAuth.verifyIdToken(authToken);
        const uid = decoded.uid;

        const tokens = await getSpotifyTokensFromUser(uid);
        
        if (!tokens || !tokens.access_token || !tokens.connected) {
            throw new Error('No Spotify access token found - authentication required');
        }
        
        //if token valid, return token
        if (tokens.expires_at && Date.now() < parseInt(tokens.expires_at)) {
            return tokens.access_token;
        }
        
        // Token expired, refresh it
        return await refreshToken(authToken);
    } catch (error) {
        console.error('Get valid token failed:', error);
        throw new Error('Spotify authentication required');
    }
}
