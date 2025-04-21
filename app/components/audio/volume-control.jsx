import { ChangeEvent, useState, useEffect } from "react";
import { IoMdVolumeHigh, IoMdVolumeOff, IoMdVolumeLow } from "react-icons/io";
import { useAudioPlayerContext } from "../../../context/audio-player-context";

export const VolumeControl = () => {
  const { audioRef } = useAudioPlayerContext();
  const [volume, setVolume] = useState(60);
  const [muteVolume, setMuteVolume] = useState(false);
  const handleVolumeChange = (e) => {
    setVolume(Number(e.target.value));
  };
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = muteVolume;
    }
  }, [volume, audioRef, muteVolume]);

  return (
    <Box display="flex" alignItems="center" gap={2}>
      {/* toggle mute/unmute button */}
      <IconButton onClick={() => setMuteVolume((prev) => !prev)}>
        {muteVolume || volume < 5 ? (
          <IoMdVolumeOff size={25} />
        ) : volume < 40 ? (
          <IoMdVolumeLow size={25} />
        ) : (
          <IoMdVolumeHigh size={25} />
        )}
      </IconButton>

      {/* volume slider input */}
      <Slider
        min={0}
        max={100}
        value={volume}
        onChange={handleVolumeChange}
        sx={{
          width: 120,
          color: "#E03FD8",
          "& .MuiSlider-thumb": { width: 12, height: 12 },
        }}
      />
    </Box>
  );
};
