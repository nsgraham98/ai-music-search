// app/api/spotify/accesstoken/spotifyroute.js
// TODO: 


//Notes:
// Most of this implementation directly from spotify docs.
//uses pkce auth flow.
export default async function spotifyaccess (req) {
const { token} = req.body; // access token from spotify.

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_SECRET;

const redirect_uri = "https://ai-music-search.vercel.app/"

const scope = 'user-read-private user-read-email';
const authUrl = new URL('https://accounts.spotify.com/authorize');


const generateRandomString = (Length) => {
    const possible ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const values = crypto.getRandomValues(new Uint8Array(Length));
    return values.reduce ((acc, x) => acc + possible[x % possible.length], "");
}

const code_verifier = generateRandomString(64);

// must transform using sha256 algorithm. This value gets sent with user auth request.
const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
}
//returns base64 version of the sha256 hash.
const base64encode = (input) =>{
    return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

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