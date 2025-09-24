//Testing getting track by search
// Will be our main way to get tracks.
const accessToken = localStorage.getItem('access_token');
const trackName = 'Believer';

// GET /search
// performed first to get track ID.
const searchResponse = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(trackName)}&type=track`,
{
    headers:{
        'Authorization': `Bearer ${accessToken}`,
    },
} 
);
const data = await searchResponse.json();
console.log(data.tracks.items[0]); // Check, logs first item in tracks array.

// GET /artists/{id}

// GET /albums/{id}

// GET /