// app/api/spotify/accesstoken/spotifyroute.js
import { adminAuth, db } from "@/lib/firebase-admin";

// TODO: 
// Implement error handling 
// -- startspotifyauth needs to handle error case from api.

//Notes:
// Most of this implementation directly from spotify docs.
// uses pkce auth flow.
// This access token only lasts an hour.

//function for session-based token storage
async function saveSpotifyTokensToSession(uid, spotifyTokens) {
  await db.collection("sessions").doc(uid).set(
    {
      sessionData: {
        spotify_access_token: spotifyTokens.access_token,
        spotify_refresh_token: spotifyTokens.refresh_token,
        spotify_expires_at: spotifyTokens.expires_at,
        spotify_code_verifier: spotifyTokens.code_verifier,
      }
    },
    { merge: true }
  );
}

async function getSpotifyTokensFromSession(uid) {
  const sessionDoc = await db.collection("sessions").doc(uid).get();
  if (!sessionDoc.exists) {
    return null;
  }
  const sessionData = sessionDoc.data().sessionData;
  return {
    access_token: sessionData.spotify_access_token,
    refresh_token: sessionData.spotify_refresh_token,
    expires_at: sessionData.spotify_expires_at,
    code_verifier: sessionData.spotify_code_verifier,
  };
}

// Generating string for verifier - SERVER SIDE VERSION
function generateRandomString(length) {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const crypto = require('crypto');
    const values = crypto.randomBytes(length);
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}
// transforms using SHA256 algo - SERVER SIDE VERSION
async function sha256(plain) {
    const crypto = await import('crypto');
    return crypto.createHash('sha256').update(plain).digest();
}
//returns base64 version of the sha256 hash - SERVER SIDE VERSION
function base64encode(input) {
    return input.toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

// SERVER SIDE VERSION - Returns auth URL and saves verifier
export async function generateSpotifyAuthUrl(authToken, redirectUri) {
    try {
        // Verify user authentication
        const decoded = await adminAuth.verifyIdToken(authToken);
        const uid = decoded.uid;
        
        const code_verifier = generateRandomString(128); // max length allowed by api.
        
        // Save code verifier to session
        await saveSpotifyTokensToSession(uid, {
            code_verifier,
            access_token: null,
            refresh_token: null,
            expires_at: null
        });
        
        const authUrl = new URL('https://accounts.spotify.com/authorize'); //Spotify auth endpoint.
        const clientID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID; // from .env file.
        
        //Code Challenge
        const hashedVerifier = await sha256(code_verifier);
        const codeChallenge = base64encode(hashedVerifier);
        
        //Scope
        const scope = 'user-read-private user-read-email playlist-read-private playlist-read-collaborative'; //scopes needed for search and playlists
        
        //Formatting params for endpoint.
        const params = {
            response_type: 'code',
            client_id: clientID,
            scope,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            redirect_uri: redirectUri,
        };
        authUrl.search = new URLSearchParams(params).toString();
        
        return authUrl.toString();
    } catch (error) {
        console.error('Generate auth URL error:', error);
        throw error;
    }
}
// POST request to get access token - SERVER SIDE VERSION
export async function getToken(code, authToken) {
    try {
        // Verify user authentication
        const decoded = await adminAuth.verifyIdToken(authToken);
        const uid = decoded.uid;
        
        // Get code verifier from session
        const tokens = await getSpotifyTokensFromSession(uid);
        const codeVerifier = tokens?.code_verifier;
        
        if (!codeVerifier) {
            throw new Error('Code verifier not found in session');
        }
        
        const url = 'https://accounts.spotify.com/api/token';
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
                grant_type: 'authorization_code',
                code,
                redirect_uri: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
                code_verifier: codeVerifier,
            }),
        };
        
        const body = await fetch(url, payload);
        const response = await body.json();
        
        if (response.error) {
            throw new Error(`Spotify API error: ${response.error_description}`);
        }
        
        // Save tokens to session
        await saveSpotifyTokensToSession(uid, {
            access_token: response.access_token,
            refresh_token: response.refresh_token,
            expires_at: Date.now() + (response.expires_in * 1000),
            code_verifier: codeVerifier, // Keep for future use
        });
        
        return response.access_token;
    } catch (error) {
        console.error('Token exchange error:', error);
        throw error;
    }
}

// Function to refresh the access token - SERVER SIDE VERSION
export async function refreshToken(authToken) {
    try {
        // Verify user authentication
        const decoded = await adminAuth.verifyIdToken(authToken);
        const uid = decoded.uid;
        
        // Get refresh token from session
        const tokens = await getSpotifyTokensFromSession(uid);
        const refreshTokenValue = tokens?.refresh_token;
        
        if (!refreshTokenValue) {
            throw new Error('No refresh token available');
        }
        
        const url = 'https://accounts.spotify.com/api/token';
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
                grant_type: 'refresh_token',
                refresh_token: refreshTokenValue,
            }),
        };
        
        const body = await fetch(url, payload);
        const response = await body.json();
        
        if (response.error) {
            throw new Error(`Token refresh failed: ${response.error_description}`);
        }
        
        // Update stored tokens in session
        await saveSpotifyTokensToSession(uid, {
            access_token: response.access_token,
            refresh_token: response.refresh_token || refreshTokenValue,
            expires_at: Date.now() + (response.expires_in * 1000),
            code_verifier: tokens.code_verifier,
        });
        
        return response.access_token;
    } catch (error) {
        console.error('Token refresh error:', error);
        throw error;
    }
}

// Function to get a valid access token (refresh if needed) - SERVER SIDE VERSION
export async function getValidAccessToken(authToken) {
    try {
        // Verify user authentication
        const decoded = await adminAuth.verifyIdToken(authToken);
        const uid = decoded.uid;
        
        // Get tokens from session
        const tokens = await getSpotifyTokensFromSession(uid);
        
        if (!tokens || !tokens.access_token) {
            throw new Error('No access token found');
        }
        
        // Check if token exists and is not expired
        if (tokens.expires_at && Date.now() < parseInt(tokens.expires_at)) {
            return tokens.access_token;
        }
        
        // Token is expired, try to refresh
        return await refreshToken(authToken);
    } catch (error) {
        console.error('Get valid token failed:', error);
        throw new Error('Authentication required');
    }
}
