// Volume control component
// Volume slider and mute/unmute button
// Used in audio-player.jsx

"use client";

import { useState, useEffect } from "react";
import { IoMdVolumeHigh, IoMdVolumeOff, IoMdVolumeLow } from "react-icons/io";
import { useAudioPlayerContext } from "@/context/audio-player-context";
import { Box, IconButton, Slider } from "@mui/material";

export const VolumeControl = () => {
  const { audioRef } = useAudioPlayerContext(); // ref for the <audio> element

  const [volume, setVolume] = useState(60); // initial volume %
  const [muteVolume, setMuteVolume] = useState(false); // mute toggle

  // onChange handler for volume slider
  const handleVolumeChange = (e, newValue) => {
    setVolume(newValue);
  };

  // listener for volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = muteVolume;
    }
  }, [volume, muteVolume, audioRef]); // dependencies

  return (
    <Box display="flex" alignItems="center" gap={2}>
      {/* toggle mute/unmute button */}
      <IconButton onClick={() => setMuteVolume((prev) => !prev)}>
        {muteVolume || volume < 5 ? (
          <IoMdVolumeOff size={25} color="white" />
        ) : volume < 40 ? (
          <IoMdVolumeLow size={25} color="white" />
        ) : (
          <IoMdVolumeHigh size={25} color="white" />
        )}
      </IconButton>

      {/* volume slider input */}
      <Slider
        min={0}
        max={100}
        value={volume}
        onChange={handleVolumeChange}
        sx={{
          width: "10vw",
          color: "#E03FD8",
          "& .MuiSlider-thumb": { width: 12, height: 12 },
        }}
      />
    </Box>
  );
};
