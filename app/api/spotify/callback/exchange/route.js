// API route to exchange Spotify authorization code for access token
// Called client-side after Spotify redirects back with the code
import { NextResponse } from "next/server";
import { exchangeCodeForToken } from "../../accesstoken/spotifyroute";

export async function POST(request) {
    try {
        // Get auth token from headers
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'No auth token provided' }, { status: 401 });
        }
        const authToken = authHeader.substring(7);
        
        // Get code from body
        const { code } = await request.json();
        
        if (!code) {
            return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
        }
        
        console.log('Exchanging Spotify code for tokens...');
        
        // Exchange code for access token
        const accessToken = await exchangeCodeForToken(code, authToken);
        
        return NextResponse.json({ 
            success: true, 
            message: 'Spotify connected successfully',
            accessToken: accessToken 
        });
        
    } catch (error) {
        console.error('Token exchange error:', error);
        return NextResponse.json(
            { error: 'Failed to exchange token', details: error.message },
            { status: 500 }
        );
    }
}
