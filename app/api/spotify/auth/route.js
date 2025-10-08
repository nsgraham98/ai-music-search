// Spotify auth route - generates authorization URL
import { generateSpotifyAuthUrl } from '../accesstoken/spotifyroute.js';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { redirectUri } = await request.json();
        
        // Get auth token from headers
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'No auth token provided' }, { status: 401 });
        }
        const authToken = authHeader.substring(7);
        
        if (!redirectUri) {
            return NextResponse.json({ error: 'Redirect URI is required' }, { status: 400 });
        }
        
        // Generate auth URL
        const authUrl = await generateSpotifyAuthUrl(authToken, redirectUri);
        
        return NextResponse.json({ authUrl });
        
    } catch (error) {
        console.error('Auth URL generation error:', error);
        return NextResponse.json(
            { error: 'Failed to generate auth URL', details: error.message },
            { status: 500 }
        );
    }
}