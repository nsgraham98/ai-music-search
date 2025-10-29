// Client-side Spotify authentication helper
// Uses browser APIs (crypto.subtle, btoa, window) for PKCE flow

// Generate random string for code verifier
function generateRandomString(length) {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

// Transform using SHA256 algorithm
async function sha256(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return crypto.subtle.digest('SHA-256', data);
}

// Returns base64 version of the SHA256 hash
function base64encode(input) {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

// Start Spotify authentication flow
export async function startSpotifyAuth(user) {
    console.log('=== Starting Spotify Auth ===');
    console.log('User:', user ? 'authenticated' : 'not authenticated');
    console.log('Client ID:', process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID);
    console.log('Redirect URI:', process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI);
    
    if (!user) {
        throw new Error('User not authenticated');
    }

    try {
        // Generate code verifier and challenge
        console.log('Generating PKCE parameters...');
        const codeVerifier = generateRandomString(128);
        console.log('Code verifier generated:', codeVerifier.substring(0, 20) + '...');
        
        const hashedVerifier = await sha256(codeVerifier);
        const codeChallenge = base64encode(hashedVerifier);
        console.log('Code challenge generated:', codeChallenge.substring(0, 20) + '...');

        // Store code_verifier on server via init endpoint
        console.log('Getting user ID token...');
        const token = await user.getIdToken();
        console.log('Token obtained:', token.substring(0, 20) + '...');
        
        console.log('Calling init endpoint...');
        const response = await fetch('/api/spotify/accesstoken/init', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code_verifier: codeVerifier })
        });

        console.log('Init response status:', response.status);
        
        if (!response.ok) {
            const error = await response.json();
            console.error('Init endpoint error:', error);
            throw new Error(error.error || 'Failed to initialize Spotify auth');
        }
        
        const initResult = await response.json();
        console.log('Init result:', initResult);

        // Create Spotify authorization URL
        const authUrl = new URL('https://accounts.spotify.com/authorize');
        // Use environment variable for redirect URI (for ngrok/production)
        const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || `${window.location.origin}/api/spotify/callback`;
        
        console.log('Building auth URL with redirect URI:', redirectUri);
        
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('client_id', process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID);
        authUrl.searchParams.append('scope', 'user-read-private user-read-email playlist-read-private playlist-read-collaborative');
        authUrl.searchParams.append('code_challenge_method', 'S256');
        authUrl.searchParams.append('code_challenge', codeChallenge);
        authUrl.searchParams.append('redirect_uri', redirectUri);

        const finalAuthUrl = authUrl.toString();
        console.log('Final auth URL:', finalAuthUrl);
        console.log('Redirecting to Spotify...');

        // Redirect to Spotify
        window.location.href = finalAuthUrl;

    } catch (error) {
        console.error('Error starting Spotify auth:', error);
        throw new Error('Spotify authentication initiation failed: ' + error.message);
    }
}