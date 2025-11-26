// Utility functions for Spotify API calls
import { dbAdmin } from './firebase-admin';

/**
 * Get valid Spotify access token for a user
 * Automatically refreshes if expired
 */
export async function getSpotifyAccessToken(uid) {
  const sessionDoc = await dbAdmin.collection('sessions').doc(uid).get();
  const spotifyTokens = sessionDoc.data()?.spotifyTokens;

  if (!spotifyTokens) {
    throw new Error('Spotify not connected');
  }

  // Check if token is expired
  if (Date.now() >= spotifyTokens.expires_at) {
    // Refresh token
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: spotifyTokens.refresh_token,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh Spotify token');
    }

    const tokens = await response.json();

    // Update tokens
    await dbAdmin.collection('sessions').doc(uid).update({
      'spotifyTokens.access_token': tokens.access_token,
      'spotifyTokens.expires_at': Date.now() + tokens.expires_in * 1000,
      ...(tokens.refresh_token && {
        'spotifyTokens.refresh_token': tokens.refresh_token,
      }),
    });

    return tokens.access_token;
  }

  return spotifyTokens.access_token;
}

/**
 * Make authenticated request to Spotify API
 */
export async function spotifyApiRequest(uid, endpoint, options = {}) {
  const accessToken = await getSpotifyAccessToken(uid);

  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.statusText}`);
  }

  return response.json();
}