import { BsMusicNoteBeamed } from "react-icons/bs";
import { useAudioPlayerContext } from "../../../context/audio-player-context";
import { testTracks } from "../../../data/test-tracks/testTracks.js";

export function handleSearchResults(searchResults) {}

// i think we can repurpose this component for the search results
export const PlayList = () => {
  const { currentTrack, setCurrentTrack, setIsPlaying, tracks } =
    useAudioPlayerContext();

  const handleClick = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  // thumbnail might be broken - attribute does not exist in our test tracks
  return (
    <ul className="bg-[#4c4848] text-white max-h-72  overflow-y-auto">
      {tracks.map((track, index) => (
        <li
          key={index}
          className={`flex items-center gap-3 p-[0.5rem_10px] cursor-pointer ${
            currentTrack?.name === track.name ? "bg-[#a66646]" : ""
          }`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleClick(track);
            }
          }}
          onClick={() => handleClick(track)}
        >
          <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-sm overflow-hidden"></div>
          <div>
            <p className="font-bold text-sm">Song: {track.name}</p>
            <p className="text-sm text-gray-400">Artist: {track.artist_name}</p>
            <br />
          </div>
        </li>
      ))}
    </ul>
  );
};

{
  /* {track.thumbnail ? (
    <img
      className="w-full h-full object-cover"
      src={track.thumbnail}
      alt="audio avatar"
    />
  ) : (
    <div className="flex items-center justify-center w-full h-full bg-gray-300 rounded-md">
      <span className="text-xl text-gray-600">
        <BsMusicNoteBeamed />
      </span>
    </div>
  )} */
}
