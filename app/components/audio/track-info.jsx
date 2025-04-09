import { useAudioPlayerContext } from "../../../context/audio-player-context";
// import { BsMusicNoteBeamed } from "react-icons/bs";

export const TrackInfo = () => {
  const { currentTrack } = useAudioPlayerContext();
  if (!currentTrack) {
    return (
      <div>
        <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded-md overflow-hidden"></div>
        <div className="flex flex-col gap-2">
          <p className="font-bold lg:truncate lg:max-w-64">No track selected</p>
          <p className="text-sm text-gray-400">No artist</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-4">
      <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded-md overflow-hidden"></div>
      <div>
        <p className="font-bold lg:truncate lg:max-w-64">{currentTrack.name}</p>
        <p className="text-sm text-gray-400">{currentTrack.artist}</p>
      </div>
    </div>
  );
};
// add to return statement if we want thumbnail handling

// {currentTrack.thumbnail ? (
//   <img
//     className="w-full h-full object-cover"
//     src={currentTrack.thumbnail}
//     alt="audio avatar"
//   />
// ) : (
//   <div className="flex items-center justify-center w-full h-full bg-gray-300 rounded-md">
//     <span className="text-xl text-gray-600">
//       <BsMusicNoteBeamed />
//     </span>
//   </div>
// )}
