import { adminAuth, db } from '../../../../../lib/firebase-admin';
import { authenticateCookie } from '../../../../../lib/authenticate-calls';
import { NextResponse } from 'next/server';

// POST /api/spotify/accesstoken/init
// Stores the code_verifier in Firestore for later use during token exchange
export async function POST(request) {
    console.log('=== Spotify Init Endpoint ===');
    console.log('Request headers:', Object.fromEntries(request.headers.entries()));
    
    try {
        let uid = null;
        
        // Try authorization header first (ID token)
        const authHeader = request.headers.get('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            console.log('Attempting ID token authentication...');
            try {
                const token = authHeader.replace('Bearer ', '');
                const decoded = await adminAuth.verifyIdToken(token);
                uid = decoded.uid;
                console.log('ID token authentication successful:', uid);
            } catch (error) {
                console.log('ID token authentication failed:', error.message);
            }
        }
        
        // If ID token failed, try cookie authentication
        if (!uid) {
            console.log('Attempting cookie authentication...');
            try {
                const authResult = await authenticateCookie(request);
                if (authResult.success) {
                    uid = authResult.uid;
                    console.log('Cookie authentication successful:', uid);
                } else {
                    console.log('Cookie authentication failed:', authResult.error);
                }
            } catch (error) {
                console.log('Cookie authentication error:', error.message);
            }
        }
        
        // If both failed
        if (!uid) {
            console.error('Both authentication methods failed');
            return NextResponse.json(
                { error: 'Authentication required - please provide valid ID token or session cookie' },
                { status: 401 }
            );
        }

        // Get the code_verifier from the request body
        const { code_verifier } = await request.json();
        console.log('Code verifier received:', code_verifier ? `${code_verifier.substring(0, 20)}...` : 'null');
        
        if (!code_verifier) {
            return NextResponse.json(
                { error: 'Missing code_verifier in request body' },
                { status: 400 }
            );
        }

        // Store the code_verifier in Firestore
        console.log('Storing code verifier for user:', uid);
        await db.collection('users').doc(uid).set(
            { spotify_code_verifier: code_verifier },
            { merge: true }
        );

        console.log('Code verifier stored successfully');
        return NextResponse.json({ 
            success: true,
            message: 'Code verifier stored successfully',
            uid: uid
        });

    } catch (error) {
        console.error('Error storing code verifier:', error);
        return NextResponse.json(
            { error: 'Failed to store code verifier: ' + error.message },
            { status: 500 }
        );
    }
}