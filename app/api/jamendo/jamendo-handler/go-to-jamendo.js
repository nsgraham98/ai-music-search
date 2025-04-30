export function goToTrack(track) {
  if (!track || !track.id) return;
  const track_name = track.name.replace(/\s+/g, "-").toLowerCase();
  window.open(
    `https://www.jamendo.com/track/${track.id}/${track_name}`,
    "_blank"
  );
}
export function goToArtist(track) {
  if (!track || !track.artist_id) return;
  const artist_name = track.artist_name.replace(/\s+/g, "-").toLowerCase();
  window.open(
    `https://www.jamendo.com/artist/${track.artist_id}/${artist_name}`,
    "_blank"
  );
}
export function goToAlbum(track) {
  if (!track || !track.album_id) return;
  const album_name = track.album_name.replace(/\s+/g, "-").toLowerCase();
  window.open(
    `https://www.jamendo.com/album/${track.album_id}/${album_name}`,
    "_blank"
  );
}
