// calls the Jamendo API to get the search results
export async function searchJamendo(searchObj) {
  console.log("in searchJamendo function"); // Log to check if the function is called
  console.log("Search Object: ", searchObj); // Log the search object for debugging

  const url = createSearchString(searchObj);
  console.log("Created URL from createSearchString: ", url); // Log the query string for debugging

  // Fetch the data from the Jamendo API
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  // console.log("Jamendo API Response (in searchJamendo): ", data); // Log the response for debugging
  // do something with the data
}

// creates a url to use to call the Jamendo API at app/api/jamendo/route.js
// with the search parameters included in the url
export function createSearchString(searchObj) {
  console.log("in createSearchString function"); // Log to check if the function is called

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
  console.log("Flattened Fuzzy Tags: ", flattenedFuzzyTags); // Log the flattened fuzzy tags for debugging

  const dynamicSearchParams = {
    ...searchObj,
    fuzzytags: flattenedFuzzyTags,
  };
  console.log("Dynamic Search Params: ", dynamicSearchParams); // Log the dynamic search params for debugging

  // flattens any other dynamic tags
  const flattenedDynamicSearchParams = Object.fromEntries(
    Object.entries(dynamicSearchParams).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.join("+") : value,
    ])
  );

  console.log(
    "Flattened Dynamic Search Params: ",
    flattenedDynamicSearchParams
  ); // Log the flattened dynamic search params for debugging

  const searchParams = {
    ...staticSearchParams,
    ...flattenedDynamicSearchParams,
  };

  console.log("Combined Search Params: ", searchParams); // Log the combined search params for debugging

  const urlSearchParams = new URLSearchParams(searchParams).toString();
  const url = new URL(`http://localhost:3000/api/jamendo?${urlSearchParams}`); // will need to be changed to production URL
  console.log("Generated URL:", url.toString());
  return url.toString();
}
