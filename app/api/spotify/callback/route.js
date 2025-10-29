// API route to handle Spotify token exchange
import { NextResponse } from "next/server";
import { checkAccessToken } from "../accesstoken/spotifyroute";
import { exchangeCodeForToken } from "../accesstoken/spotifyroute";

export async function POST(request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        
        // Get auth token from headers
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'No auth token provided' }, { status: 401 });
        }
        const authToken = authHeader.substring(7);
        
        if (error) {
            console.error('Spotify auth error:', error);
            return NextResponse.json({ error: 'Spotify authorization failed' }, { status: 400 });
        }
        
        if (!code) {
            return NextResponse.json({ error: 'No authorization code received' }, { status: 400 });
        }
        
        // Exchange code for access token
        const accessToken = await exchangeCodeForToken(code, authToken);
        
        return NextResponse.json({ 
            success: true, 
            message: 'Spotify connected successfully',
            accessToken: accessToken 
        });
        
    } catch (error) {
        console.error('Callback error:', error);
        return NextResponse.json(
            { error: 'Failed to process callback', details: error.message },
            { status: 500 }
        );
    }
}