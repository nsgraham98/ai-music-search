// app/api/spotify/accesstoken/spotifyroute.js
// TODO: 
//Implement error handling
// Token refresh logic. (or rewrite using another auth flow).


//Notes:
// Most of this implementation directly from spotify docs.
//uses pkce auth flow.
// This access token only lasts an hour. 

// Generating string for verifier
function generateRandomString (length) {
    const possible ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(Length));
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


async function startSpotifyAuth () {
    const coder_verifier = generateRandomString(128); // max length allowed by api.
    localStorage.setItem('code_verifier', code_verifier); // store for later use according to api doc.

    const hashedVerifier = await sha256(code_verifier);
    const code_challenge = base64encode(hashedVerifier);

    const params = {
        response_type: 'code',
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: 'user-read-private user-read-email', //scopes needed. if not provided only pubily avilable info granted. these get subscription and email info.
        redirect_uri: 'http://172.25.96.1:3000' ,
        code_challenge_method: 'S256',
        code_challenge,
    };

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString(); //redirect to spotify login page.
}








// Old version of access token function. 
export default async function spotifyAccess (req) {
const { token} = req.body; // access token from spotify.
const code_verifier = generateRandomString(128); //max length allowed by api.
const hashedVerifier = await sha256(code_verifier);
const code_challenge = base64encode(hashedVerifier);

const redirect_uri = "http://127.0.0.1:3000"

const authUrl = new URL('https://accounts.spotify.com/authorize');

//Code Challenge 
const hashed = await sha256(code_verifier);
const codeChallenge = base64encode(hashed);

window.localStorage.setItem('code_verifier', code_verifier);

//params required by the spotify autherize endopoint.
const params = {
    response_type: 'code',
    client_id: client_id,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirectUri: redirect_uri,
};

authUrl.search = new URLSearchParaks(params).toString();
window.location.href = authUrl.toString();

//if user accepts Oauth redirect backt to redirect_uri

//parse URL for code.

const urlParams = new URLSearchParams(window.location.search);
let code = urlParams.get('code');

const getToken = async code => {
    const code_verifier = localStorage.getItem('code_verifier');

    const url = 'https://accounts.spotify.com/api/token';
    const payload = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            client_id: client_id,
            grant_type: 'authorization_code',
            code,
            redirect_uri: redirect_uri,
            code_verifier: code_verifier,
        }),
    }

    const body = await fetch(url, payload);
    const respone = await body.json();

    localStorage.setItem('access_token', response.access_token);

}

}