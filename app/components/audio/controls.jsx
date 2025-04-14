// currently does not include things like shuffle, repeat, next track, prev track, etc.
// but can be added later
// stopped following tutorial code at this point ("Handling the next track")
// https://blog.logrocket.com/building-audio-player-react/

"use client";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  BsFillPauseFill,
  BsFillPlayFill,
  BsSkipStartFill,
  BsSkipEndFill,
  BsFillFastForwardFill,
  BsFillRewindFill,
  BsRepeat,
  BsShuffle,
} from "react-icons/bs";
import { useAudioPlayerContext } from "../../../context/audio-player-context";

export const Controls = () => {
  const {
    currentTrack,
    audioRef,
    setTrackIndex,
    setCurrentTrack,
    setDuration,
    duration,
    setTimeProgress,
    progressBarRef,
    isPlaying,
    setIsPlaying,
    tracks,
  } = useAudioPlayerContext();
  const [isShuffle, setIsShuffle] = useState(false); // not used yet, but can be added later
  const [isRepeat, setIsRepeat] = useState(false); // not used yet, but can be added later

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

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 15;
      updateProgress(); // Update progress immediately after skipping
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 15;
      updateProgress(); // Update progress immediately after skipping
    }
  };

  const handlePrevious = useCallback(() => {
    setTrackIndex((prev) => {
      const newIndex = isShuffle
        ? Math.floor(Math.random() * tracks.length)
        : prev === 0
          ? tracks.length - 1
          : prev - 1;
      setCurrentTrack(tracks[newIndex]);
      return newIndex;
    });
  }, [isShuffle, setCurrentTrack, setTrackIndex, tracks]);

  const handleNext = useCallback(() => {
    setTrackIndex((prev) => {
      const newIndex = isShuffle
        ? Math.floor(Math.random() * tracks.length)
        : prev >= tracks.length - 1
          ? 0
          : prev + 1;
      setCurrentTrack(tracks[newIndex]);
      return newIndex;
    });
  }, [isShuffle, setCurrentTrack, setTrackIndex, tracks]);

  useEffect(() => {
    const currentAudioRef = audioRef.current;
    if (currentAudioRef) {
      currentAudioRef.onended = () => {
        if (isRepeat) {
          currentAudioRef.play();
        } else {
          handleNext();
        }
      };
    }
    return () => {
      if (currentAudioRef) {
        currentAudioRef.onended = null; // Clean up the event listener
      }
    };
  }, [isRepeat, handleNext, audioRef]);

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
        src={currentTrack.audio}
        ref={audioRef}
        onLoadedMetadata={onLoadedMetadata}
      />
      <button onClick={() => setIsRepeat((prev) => !prev)}>
        <BsRepeat size={20} className={isRepeat ? "text-[#f50]" : ""} />
      </button>
      <button onClick={handlePrevious}>
        <BsSkipStartFill size={20} />
      </button>
      <button onClick={skipBackward}>
        <BsFillRewindFill size={20} />
      </button>
      <button onClick={() => setIsPlaying((prev) => !prev)}>
        {isPlaying ? (
          <BsFillPauseFill size={30} />
        ) : (
          <BsFillPlayFill size={30} />
        )}
      </button>
      <button onClick={skipForward}>
        <BsFillFastForwardFill size={20} />
      </button>
      <button onClick={handleNext}>
        <BsSkipEndFill size={20} />
      </button>
      <button onClick={() => setIsShuffle((prev) => !prev)}>
        <BsShuffle size={20} className={isShuffle ? "text-[#f50]" : ""} />
      </button>
    </div>
  );
};
