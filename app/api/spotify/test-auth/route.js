import { NextResponse } from 'next/server';

// Simple test endpoint to verify Spotify auth flow works without authentication
export async function POST(request) {
    console.log('=== Spotify Test Auth Endpoint ===');
    
    try {
        const { code_verifier } = await request.json();
        
        if (!code_verifier) {
            return NextResponse.json(
                { error: 'Missing code_verifier in request body' },
                { status: 400 }
            );
        }
        
        console.log('Code verifier received:', code_verifier.substring(0, 20) + '...');
        
        // For testing, just return success without storing anything
        return NextResponse.json({ 
            success: true,
            message: 'Test endpoint working',
            code_verifier_length: code_verifier.length
        });
        
    } catch (error) {
        console.error('Error in test endpoint:', error);
        return NextResponse.json(
            { error: 'Test endpoint failed: ' + error.message },
            { status: 500 }
        );
    }
}

// Test Spotify auth URL generation
export async function GET() {
    console.log('=== Testing Spotify Auth URL Generation ===');
    
    try {
        const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
        const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
        
        console.log('Client ID:', clientId ? 'Set' : 'Missing');
        console.log('Redirect URI:', redirectUri);
        
        if (!clientId) {
            return NextResponse.json({ 
                error: 'NEXT_PUBLIC_SPOTIFY_CLIENT_ID not set' 
            }, { status: 500 });
        }
        
        // Create test Spotify auth URL
        const authUrl = new URL('https://accounts.spotify.com/authorize');
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('client_id', clientId);
        authUrl.searchParams.append('scope', 'user-read-private user-read-email');
        authUrl.searchParams.append('redirect_uri', redirectUri || 'http://localhost:3000/api/spotify/callback');
        
        return NextResponse.json({
            success: true,
            clientId: clientId,
            redirectUri: redirectUri,
            authUrl: authUrl.toString()
        });
        
    } catch (error) {
        console.error('Error generating auth URL:', error);
        return NextResponse.json(
            { error: 'Failed to generate auth URL: ' + error.message },
            { status: 500 }
        );
    }
}