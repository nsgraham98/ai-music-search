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

// Creates a URLSearchParams object, to be used in the url for the fetch call
// Object
function createSearchString(searchArgsObj) {
  // initialize variables
  let flattenedTags;
  let dynamicSearchParams;

  const staticSearchParams = {
    client_id: process.env.NEXT_PUBLIC_JAMENDO_CLIENT_ID,
    format: "json",
    limit: 25, // how many results to return
    type: "single albumtrack",
    audioformat: "mp32",
  };

  // "Fuzzy" tags are considered as an OR operation in search logic
  // so we flatten them into a single string with + between each tag
  // eg. fuzzytags = { genre: ["rock", "pop"], mood: ["happy"] }
  // becomes fuzzytags = "rock+pop+happy"
  const flattenedFuzzyTags = Object.values(searchArgsObj.fuzzytags)
    .flat()
    .join("+");

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
    flattenedTags = searchArgsObj.fuzzytags; // if no tags, use fuzzytags
    dynamicSearchParams = {
      ...searchArgsObj,
      fuzzytags: flattenedFuzzyTags,
    };
  }

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
