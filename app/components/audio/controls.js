import { useAudioPlayerContext } from "../../../context/audioPlayerContext";

export const Controls = () => {
  const { currentTrack } = useAudioPlayerContext();
  return (
    <div>
      <audio src={`/${currentTrack.path}`} controls />
    </div>
  );
};
