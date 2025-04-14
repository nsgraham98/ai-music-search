// calls the Jamendo API to get the search results
export async function searchJamendo(searchObj) {
  const url = createSearchString(searchObj);

  // Fetch the data from the Jamendo API at app/api/jamendo/route.js
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();

  // do something with the data - this will be the response from the Jamendo API
  // maybe process the data here or just return it - end goal is display it to Result Cards
  if (!response.ok) {
    console.error("API Error:", response.statusText);
  }
  return data; // I think openAI requires the data to be returned, can maybe instead just return a string "success" or "error" or something
}

// creates a url to use to call the Jamendo API at app/api/jamendo/route.js
// with the search parameters included in the url
function createSearchString(searchObj) {
  const staticSearchParams = {
    client_id: process.env.JAMENDO_CLIENT_ID,
    format: "json",
    limit: 3,
    type: "single albumtrack",
    audioformat: "mp32",
  };

  const flattenedFuzzyTags = Object.values(searchObj.fuzzytags)
    .flat()
    .join("+");

  const dynamicSearchParams = {
    ...searchObj,
    fuzzytags: flattenedFuzzyTags,
  };

  // flattens any other dynamic tags
  const flattenedDynamicSearchParams = Object.fromEntries(
    Object.entries(dynamicSearchParams).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.join("+") : value,
    ])
  );

  const searchParams = {
    ...staticSearchParams,
    ...flattenedDynamicSearchParams,
  };

  const urlSearchParams = new URLSearchParams(searchParams).toString();
  const url = new URL(`http://localhost:3000/api/jamendo?${urlSearchParams}`); // will need to be changed to production URL

  return url.toString();
}

// maybe not needed
// const callFunction = async (name, args) => {
//   switch (name) {
//     case "searchJamendo":
//       return await searchJamendo(args);
//     case "createSearchString":
//       return createSearchString(args);
//     // can add more functions here as needed
//     // case "anotherFunction":
//     //   return anotherFunction(args);
//     default:
//       throw new Error(`Function ${name} not found`);
//   }
// };

// export { callFunction };

// maybe not needed
// export function getNameArtistJamendo(response) {
//   const nameArtist = [];
//   for (const track of response.results) {
//     const name = track.name;
//     const artist = track.artist_name;
//     nameArtist.push({ name, artist });
//   }
//   return nameArtist;
// }
