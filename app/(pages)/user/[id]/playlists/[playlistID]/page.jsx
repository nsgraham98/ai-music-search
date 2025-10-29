"use client";

import React from "react";

export default function PlaylistsPage({ params }) {
  const { id, playlistID } = params;
  return (
    <div>
      Playlists Page for User: {id}, Playlist: {playlistID}
    </div>
  );
}
