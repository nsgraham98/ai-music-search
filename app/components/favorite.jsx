// Favorite button component to add a song to user's favorites
// NOT IN USE YET - but let's keep it for future use
// API endpoint /api/favorites still needs to be created to handle the request

export default function FavoriteButton() {
  const handleOnClick = async () => {
    const response = await fetch("/api/favorites", {
      // Replace with your actual API endpoint
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ songId: "12345" }), // Replace with actual song ID
    });

    if (response.ok) {
      console.log("Song added to favorites!");
    } else {
      console.error("Failed to add song to favorites.");
    }
  };

  return (
    <button
      onClick={handleOnClick}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Add to Favorites
    </button>
  );
}
