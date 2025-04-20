// The objective of such a request is to ask the user if he agrees to grant
// some rights to your application. The eventual agreement, will redirect the
// user to the Jamendo login form, if he is not already logged in.
// https://developer.jamendo.com/v3.0/authentication
export default async function GetJamendoAuthCode() {
  // params:
  // client_id
  // redirect_uri
  // state
  const params = new URLSearchParams({
    client_id: process.env.JAMENDO_CLIENT_ID, // Get the client ID from environment variables
    redirect_uri: process.env.JAMENDO_REDIRECT_URI, // Get the redirect URI from environment variables
    state: params.state, // Get the state from the params
  });
  const urlParams = params.toString(); // Convert the URL object to a string
  const response = await fetch(
    `https://api.jamendo.com/v3.0/oauth/authorize?${urlParams}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    console.error("API Error:", response.statusText);
    return;
  }
  const data = await response.json(); // Parse the response as JSON
  // successful response:
  // code
  // state
  // eg. redirect sample: http://YOUR_REDIRECT_URL?code=YOUR_AUTHORIZATION_CODE&state=YOUR_STATE

  // probably call get-access-token.js with the code and state params to get the access token
  // or return data
}

export async function GetJamendoAccessToken({ authCode, redirect_uri }) {
  const url = "https://api.jamendo.com/v3.0/oauth/grant";
  const params = new URLSearchParams({
    client_id: process.env.JAMENDO_CLIENT_ID,
    client_secret: process.env.JAMENDO_CLIENT_SECRET,
    grant_type: "authorization_code",
    code: authCode,
    redirect_uri: redirect_uri, // Get the redirect URI from environment variables
  });
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: params.toString(), // Send the params as a JSON string in the body of the request
  });

  if (!response.ok) {
    console.error("API Error:", response.statusText);
    return;
  }
  const data = await response.json(); // Parse the response as JSON
  // successful response:
  // access_token
  // expires_in
  // refresh token
  // scope
  // token_type
  // Success sample: {"access_token":"YOUR_NEW_ACCESS_TOKEN", "expires_in":7200,"token_type":"bearer", "scope":"music", "refresh_token":"YOUR_REFRESH_TOKEN"}
}

export async function RefreshJamendoAccessToken(refreshToken) {
  const url = "https://api.jamendo.com/v3.0/oauth/grant";

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    console.error("API Error:", response.statusText);
    return null;
  }

  const data = await response.json();
  return data;
}
