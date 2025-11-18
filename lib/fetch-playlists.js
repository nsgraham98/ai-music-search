"use client";

export async function fetchPlaylistRich() {
  try {
    const firebaseResponse = await axios.get(
      `/api/users/${authUser.uid}/playlists/${playlistID}`
    );
    console.log("Fetched playlist:", firebaseResponse.data);
    const trackIds = firebaseResponse.data.playlist.tracks;
    const jamendoResponse = await axios.get(
      `/api/jamendo/${trackIds.join("/")}`
    );
    console.log("Fetched tracks from Jamendo:", jamendoResponse.data);

    // consider waiting to set the playlist, until the user has actually clicked a track to play
    setCurrentPlaylist({
      id: firebaseResponse.data.playlist.id,
      userID: firebaseResponse.data.playlist.userID,
      name: firebaseResponse.data.playlist.name,
      public: firebaseResponse.data.playlist.public,
      description: firebaseResponse.data.playlist.description,
      timeCreated: firebaseResponse.data.playlist.timeCreated,
      timeUpdated: firebaseResponse.data.playlist.timeUpdated,
      tracks: jamendoResponse.data.results,
    });
  } catch (error) {
    console.error("Error fetching playlist:", error);
  }
}

export async function fetchPlaylists() {
  try {
    setLoading(true);
    const response = await axios.get(`/api/users/${authUser.uid}/playlists`);
    setPlaylists(response.data.playlists || []);
  } catch (error) {
    console.error("Error fetching playlists:", error);
    showSnackbar("Failed to load playlists", "error");
  } finally {
    setLoading(false);
  }
}
