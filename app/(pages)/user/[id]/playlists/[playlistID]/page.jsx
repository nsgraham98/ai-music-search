"use client";

import { Container } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useUserAuth } from "@/context/auth-context";
import { List, ListItem } from "@mui/material";

export default function PlaylistPage({ params }) {
  const { playlistID } = React.use(params);
  const [playlist, setPlaylist] = useState(null);
  const { authUser } = useUserAuth();
  const uid = authUser?.uid;

  useEffect(() => {
    // Fetch playlist data using playlistID
    async function fetchPlaylist() {
      try {
        const response = await axios.get(
          `/api/users/${uid}/playlists/${playlistID}`
        );
        setPlaylist(response.data.playlist);
      } catch (error) {
        console.error("Error fetching playlist:", error);
      }
    }
    fetchPlaylist();
  }, [playlistID]);

  return (
    <div>
      <div>
        <h1>Playlist Details</h1>
        {playlist ? (
          <div>
            <h2>{playlist.name}</h2>
          </div>
        ) : (
          <p>Loading playlist...</p>
        )}
      </div>
      <div>
        <h2>Tracks in Playlist</h2>
        {playlist && playlist.tracks && playlist.tracks.length > 0 ? (
          <List>
            {playlist.tracks.map((track, index) => (
              <ListItem key={index}>
                {track.title} by {track.artist}
              </ListItem>
            ))}
          </List>
        ) : (
          <p>No songs in this playlist.</p>
        )}
      </div>
    </div>
  );
}
