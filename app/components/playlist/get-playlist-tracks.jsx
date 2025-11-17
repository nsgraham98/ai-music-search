"use client";
import axios from "axios";
import { useTestingContext } from "@/context/testing-context";
import { useAudioPlayerContext } from "@/context/audio-player-context";
import { Button } from "@mui/material";

export const GetTracksButton = () => {
  const { testTrack, testTrack2, testTrack3 } = useTestingContext();
  const { setCurrentPlaylist } = useAudioPlayerContext();
  const tracks = [testTrack.id, testTrack2.id, testTrack3.id];
  // const tracks = [testTrack.id];

  async function getTracks() {
    try {
      const url = `/api/jamendo/${tracks.join("/")}`;
      const response = await axios.get(url);
      console.log("Component: Fetched tracks:", response.data);
      const fetchedTracks = response.data.results;
      console.log("Component: Fetched tracks array:", fetchedTracks);
      setCurrentPlaylist({
        id: "testPlaylist",
        userID: "testUserID",
        name: "Test Playlist",
        public: false,
        description: "This is a test playlist",
        timeCreated: new Date().toISOString(),
        timeUpdated: new Date().toISOString(),
        tracks: fetchedTracks,
      });
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  }

  return (
    <Button
      onClick={async () => {
        await getTracks();
      }}
    >
      Get Tracks
    </Button>
  );
};
