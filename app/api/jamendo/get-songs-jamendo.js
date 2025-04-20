export async function getSongsJamendo(searchParams) {
  const searchParamsString = searchParams.toString(); // Convert the URL object to a string

  const response = await fetch(
    `https://api.jamendo.com/v3.0/tracks/?${searchParamsString}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    console.error("API Error:", response.statusText);
    return;
  }
  const data = await response.json(); // Parse the response as JSON
  return data;
}
