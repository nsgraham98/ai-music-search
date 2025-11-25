// File for handling logic for searching Jamendo
// searchJamendo() is the only exposed method, and gets called from openai.js

// calls the Jamendo API to get the search results
// this method encapsulates the logic for creating the search string and making the API call
export async function searchJamendo(searchArgsObj) {
  const searchParams = createSearchString(searchArgsObj); // creates the URLSearchParams object to be used in the url for the fetch call
  const data = await getSongsJamendo(searchParams); // call the Jamendo API, returns JSON object with the results
  return data; // I think openAI requires the data to be returned, can maybe instead just return a string "success" or "error" or something
}

// calls the Jamendo API with the search parameters included in the url
export async function getSongsJamendo(searchParams) {
  const searchParamsString = searchParams.toString(); // Convert the URL object to a string for use in the fetch URL

  // console.log("Jamendo Search Params:", searchParamsString); // Log the search parameters for debugging
  console.log(
    `🎵 Jamendo call: https://api.jamendo.com/v3.0/tracks/?${searchParamsString}`
  );

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
  // Remove waveform data from each track to reduce payload size
  const cleaned = {
    ...data,
    results: data.results.map(({ waveform, ...rest }) => rest),
  };
  console.log("🎵 Jamendo results received:", cleaned.results.length, "tracks");
  // console.log(cleaned.results[0]);
  return cleaned;
}

// Creates a URLSearchParams object, to be used in the url for the fetch call
// Object
function createSearchString(searchArgsObj) {
  // initialize variables
  let flattenedTags;
  let flattenedFuzzyTags;
  let dynamicSearchParams;

  const staticSearchParams = {
    client_id: process.env.JAMENDO_CLIENT_ID,
    format: "json",
    limit: "50", // how many results to return - "all" returns all results, max 200
    type: "single albumtrack",
    audioformat: "mp32",
    // boost: "popularity_month",
  };

  // "Fuzzy" tags are considered as an OR operation in search logic
  // so we flatten them into a single string with + between each tag
  // eg. fuzzytags = { genre: ["rock", "pop"], mood: ["happy"] }
  // becomes fuzzytags = "rock+pop+happy"
  if (searchArgsObj.fuzzytags) {
    flattenedFuzzyTags = Object.values(searchArgsObj.fuzzytags)
      .flat()
      .join("+");
  } else {
    flattenedFuzzyTags = "";
  }

  // if normal tags are included, flatten them too
  // these are considered as AND operation in search logic
  if (searchArgsObj.tags) {
    flattenedTags = Object.values(searchArgsObj.tags).flat().join("+");
    dynamicSearchParams = {
      ...searchArgsObj,
      fuzzytags: flattenedFuzzyTags,
      tags: flattenedTags,
    };
  } else {
    flattenedTags = "";
  }
  // combine flattened tags and fuzzytags into the search params
  dynamicSearchParams = {
    ...searchArgsObj,
    fuzzytags: flattenedFuzzyTags,
    tags: flattenedTags,
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

  // create and return the URLSearchParams object
  const urlSearchParams = new URLSearchParams(searchParams);
  return urlSearchParams;
}
