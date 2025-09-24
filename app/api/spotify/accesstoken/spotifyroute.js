// app/api/spotify/accesstoken/spotifyroute.js
// TODO: 
// Implement error handling 
// -- startspotifyauth needs to handle error case from api.
// Token refresh logic. (or rewrite using another auth flow).

//Notes:
// Most of this implementation directly from spotify docs.
// uses pkce auth flow.
// This access token only lasts an hour. 

// Generating string for verifier
function generateRandomString (length) {
    const possible ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce ((acc, x) => acc + possible[x % possible.length], "");
}
// transforms using SHA256 algo
async function sha256 (plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
}
//returns base64 version of the sha256 hash.
function base64encode (input) {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export async function startSpotifyAuth () {
    const code_verifier = generateRandomString(128); // max length allowed by api.
    localStorage.setItem('code_verifier', code_verifier); // store for later use according to api doc.
    const authUrl = new URL('https://accounts.spotify.com/authorize'); //Spotify auth endpoint.
    const redirectUri = `${window.location.origin}`; // must match one of the redirect uris in spotify dev account.
    const clientID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID; // from .env file.
    //Code Challenge
    const hashedVerifier = await sha256(code_verifier);

    const codeChallenge = base64encode(hashedVerifier);
    //Scope
    const scope ='user-read-private user-read-email'; //scopes needed. if not provided only pubily avilable info granted. these get subscription and email info.
    //Formatting params for endpoint.
    const params = {
        response_type:'code',
        client_id: clientID,
        scope,

        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri,
    };
    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString(); //redirect to spotify login page.

    // only on successful log in and user acceptance.
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');  // get code from url after redirect. need to request access token.
    
}
// POST request to get access token.
export async function getToken (code) {
    const codeVerifier = localStorage.getItem('code_verifier');
    const url = 'https://accounts.spotify.com/api/token';
    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body : new URLSearchParams({
            client_id: process.env.SPOTIFY_CLIENT_ID,
            grant_type: 'authorization_code',
            code,
            redirect_uri: 'http://172.25.96.1:3000',
            code_verifier: codeVerifier,
    }),
}
const body = await fetch(url, payload);
const response = await body.json();

//store access token in local as it only lasts an hour.
localStorage.setItem('access_token', response.access_token);

}
