// route for getting track(s) by ID from Jamendo API
// accepts multiple track IDs in an array as a parameter, or a single track ID (but must be in a single element array)
// call using:
//    axios.get(`/api/jamendo/${tracks.join("/")}`)
export async function GET(request, { params }) {
  const { trackId } = await params;
  if (!trackId || trackId.length === 0) {
    return new Response(JSON.stringify({ error: "No track ID(s) provided" }), {
      status: 400,
    });
  }
  const trackIds = Array.isArray(trackId) ? trackId.join("+") : trackId;
  const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${process.env.JAMENDO_CLIENT_ID}&id=${trackIds}`;

  // Fetch track information from Jamendo API
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    return new Response(JSON.stringify({ error: data.error }), { status: 500 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}
