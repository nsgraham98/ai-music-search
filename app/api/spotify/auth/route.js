// Spotify OAuth flow - Step 1: Redirect to Spotify login
import { NextResponse } from 'next/server';

export async function GET(request) {
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-top-read',
    'user-read-recently-played',
    'user-library-read',
    'playlist-read-private',
    'playlist-read-collaborative',
  ].join(' ');

  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
    scope: scopes,
    show_dialog: 'false',
  });

  return NextResponse.redirect(
    `https://accounts.spotify.com/authorize?${params.toString()}`
  );
}