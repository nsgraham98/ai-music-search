// API route to handle Spotify OAuth callback
// Spotify redirects here after user authorizes the app
import { NextResponse } from "next/server";
import { exchangeCodeForToken } from "../accesstoken/spotifyroute";

// Spotify OAuth sends GET request with code in query params
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const state = searchParams.get('state');
        
        console.log('=== Spotify Callback ===');
        console.log('Code:', code ? 'received' : 'missing');
        console.log('Error:', error);
        
        if (error) {
            console.error('Spotify auth error:', error);
            // Redirect to settings with error
            return NextResponse.redirect(
                new URL(`/settings?spotify_error=${encodeURIComponent(error)}`, request.url)
            );
        }
        
        if (!code) {
            return NextResponse.redirect(
                new URL('/settings?spotify_error=no_code', request.url)
            );
        }

        // For now, redirect to a page that will handle the token exchange client-side
        // This is because we need the user's Firebase token which isn't available server-side
        return NextResponse.redirect(
            new URL(`/settings?spotify_code=${code}`, request.url)
        );
        
    } catch (error) {
        console.error('Callback error:', error);
        return NextResponse.redirect(
            new URL(`/settings?spotify_error=${encodeURIComponent(error.message)}`, request.url)
        );
    }
}