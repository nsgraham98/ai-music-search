// currently does not include things like shuffle, repeat, next track, prev track, etc.
// but can be added later
// stopped following tutorial code at this point ("Handling the next track")
// https://blog.logrocket.com/building-audio-player-react/

"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import { BsFillPauseFill, BsFillPlayFill } from "react-icons/bs";
import { useAudioPlayerContext } from "../../../context/audio-player-context";

export const Controls = () => {
  const {
    currentTrack,
    audioRef,
    setDuration,
    duration,
    setTimeProgress,
    progressBarRef,
    // setTrackIndex,   // from tutorial code... not implemented yet
    // setCurrentTrack, // from tutorial code... not implemented yet
  } = useAudioPlayerContext();
  const [isPlaying, setIsPlaying] = useState(false);

  // ensures audio plays or pauses based on the "isPlaying" state
  const playAnimationRef = useRef(null);

  const updateProgress = useCallback(() => {
    if (audioRef.current && progressBarRef.current && duration) {
      const currentTime = audioRef.current.currentTime;
      setTimeProgress(currentTime);
      progressBarRef.current.value = currentTime.toString();
      progressBarRef.current.style.setProperty(
        "--range-progress",
        `${(currentTime / duration) * 100}%`
      );
    }
  }, [duration, setTimeProgress, audioRef, progressBarRef]);

  const startAnimation = useCallback(() => {
    if (audioRef.current && progressBarRef.current && duration) {
      const animate = () => {
        updateProgress();
        playAnimationRef.current = requestAnimationFrame(animate);
      };
      playAnimationRef.current = requestAnimationFrame(animate);
    }
  }, [updateProgress, duration, audioRef, progressBarRef]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play();
      startAnimation();
    } else {
      audioRef.current?.pause();
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
        playAnimationRef.current = null;
      }
      updateProgress(); // Ensure progress is updated immediately when paused
    }
    return () => {
      if (playAnimationRef.current !== null) {
        cancelAnimationFrame(playAnimationRef.current);
      }
    };
  }, [isPlaying, startAnimation, updateProgress, audioRef]);

  // displaying track duration as soon as the audio is loaded (onLoadedMetadata in <audio>)
  const onLoadedMetadata = () => {
    const seconds = audioRef.current?.duration;
    if (seconds !== undefined) {
      setDuration(seconds);
      if (progressBarRef.current) {
        progressBarRef.current.max = seconds.toString();
      }
    }
  };

  if (!currentTrack) {
    return (
      <div>
        <p className="text-gray-500">No track selected</p>
      </div>
    ); // or some loading state
  }
  return (
    <div className="flex gap-4 items-center">
      <audio
        src={currentTrack.path}
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
      />
      <button onClick={() => setIsPlaying((prev) => !prev)}>
        {isPlaying ? (
          <BsFillPauseFill size={30} />
        ) : (
          <BsFillPlayFill size={30} />
        )}
      </button>
    </div>
  );
};
