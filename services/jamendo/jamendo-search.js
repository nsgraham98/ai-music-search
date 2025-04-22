// calls the Jamendo API to get the search results
export async function searchJamendo(searchObj) {
  // const url = createSearchString(searchObj);
  const searchParams = createSearchString(searchObj);

  const data = await getSongsJamendo(searchParams); // call the Jamendo API
  return data; // I think openAI requires the data to be returned, can maybe instead just return a string "success" or "error" or something
}

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

// creates a url to use to call the Jamendo API at app/api/jamendo/route.js
// with the search parameters included in the url
function createSearchString(searchObj) {
  console.log("Search Object:", searchObj); // Debugging line to check the search object
  const staticSearchParams = {
    client_id: process.env.NEXT_PUBLIC_JAMENDO_CLIENT_ID,
    format: "json",
    limit: 10,
    type: "single albumtrack",
    audioformat: "mp32",
  };

  const flattenedFuzzyTags = Object.values(searchObj.fuzzytags)
    .flat()
    .join("+");

  let flattenedTags;
  let dynamicSearchParams;
  if (searchObj.tags) {
    flattenedTags = Object.values(searchObj.tags).flat().join("+");
    dynamicSearchParams = {
      ...searchObj,
      fuzzytags: flattenedFuzzyTags,
      tags: flattenedTags,
    };
  } else {
    flattenedTags = searchObj.fuzzytags; // if no tags, use fuzzytags
    dynamicSearchParams = {
      ...searchObj,
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

  const urlSearchParams = new URLSearchParams(searchParams);
  console.log("URL Search Params:", urlSearchParams.toString()); // Debugging line to check the URL parameters
  return urlSearchParams;
}
