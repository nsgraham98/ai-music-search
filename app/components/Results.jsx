// NOT IN USE
// would encase the <ResultCard> component to display search results with audio preview
// but we use the MUI list in audio/playlist.jsx instead for now

"use client";
// This component is responsible for displaying the search results from the API.
// import React from 'react';

// const Results = ({ tracks }) => {
//   return (
//     <div className="grid gap-4 p-4">
//       {tracks.length > 0 ? (
//         tracks.map((track) => (
//           <div key={track.id} className="border p-4 rounded shadow">
//             <h2 className="text-xl font-bold">{track.title}</h2>
//             <p>{track.genre} • {track.bpm} BPM</p>
//             <p className="italic">{track.description}</p>
//             <audio controls src={track.file_url} className="mt-2" />
//           </div>
//         ))
//       ) : (
//         <p>No results found.</p>
//       )}
//     </div>
//   );
// };

// export default Results;
