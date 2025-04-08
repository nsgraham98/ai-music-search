"use client";
import { useAudioPlayerContext } from "../../../context/audioPlayerContext";

export const Controls = () => {
  const { currentTrack } = useAudioPlayerContext();

  if (!currentTrack) {
    // Optionally, you can return a loading spinner or message while the track is being fetched
    return <div>Loading...</div>;
  }
  return (
    <div>
      <audio src={`/${currentTrack.path}`} controls />
    </div>
  );
};
