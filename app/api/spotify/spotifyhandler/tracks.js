//Testing getting track by search
const accessToken = localStorage.getItem('access_token');
const trackName = 'Believer';

const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(trackName)}&type=track`,
{
    headers:{
        'Authorization': `Bearer ${accessToken}`,
    },
}
);

const data = await response.json();
console.log(data.tracks.items[0]); // Check, logs first item in tracks array.