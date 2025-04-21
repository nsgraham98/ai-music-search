import { readFile } from "fs/promises";
import path from "path";

// temporary testing solution
// const tagsFilePath = path.join(process.cwd(), "public/assets/search-tags.json");
// const fileContent = readFileSync(tagsFilePath, "utf-8");
// const tags = JSON.parse(fileContent);

const loadTags = async () => {
  const tagsFilePath = path.join(
    process.cwd(),
    "/lib/search-data/search-tags.json"
  );
  const file = await readFile(tagsFilePath, "utf-8");
  const parsedFile = JSON.parse(file);
  return parsedFile;
  // const response = await fetch("/assets/search-tags.json");
  // const data = await response.json();
  // return data;
};

export async function getTools() {
  const tags = await loadTags(); // Load the tags from the JSON file

  const tools = [
    {
      type: "function",
      name: "searchJamendo",
      description: `You are a helpful assistant and your goal is to help parse the user's request and generate search parameter "tags" for the Jamendo API. The available tags are given to you as parameters. 
      After deciding which tags to use, you will call the searchJamendo function with the generated tags. The tags you choose will be used as args in searchJamendo(args).
      All parameters are optional except fuzzytags. Prioritize using fuzzytags, and use other parameters as you deem necessary.
      The fuzzytags parameter is a combination of energy, mood, genres, and instruments. You can use any combination of these fuzzytags to create a search query. 
      The database is large so you can be quite specific, and you must include at least 20 tags.
      In your final response, do not include the titles of the songs or the artists. The response from the Jamendo API will include the song titles and artists, so you don't need to include them in your response.
      `,
      strict: false,
      parameters: {
        type: "object",
        properties: {
          acousticelectric: {
            type: "array",
            description:
              "Only include if the user specifies a preference for acoustic or electric tracks. Otherwise omit this parameter, and both acoustic and electric tracks will be included.",
            items: { type: "string", enum: tags.acousticelectric },
          },
          vocalinstrumental: {
            type: "array",
            description:
              "Only include if the user specifies a preference for vocal or instrumental tracks. Otherwise omit this parameter, and both vocal and instrumental tracks will be included.",
            items: { type: "string", enum: tags.vocalinstrumental },
          },
          gender: {
            type: "array",
            items: { type: "string", enum: tags.gender },
          },
          speed: {
            type: "array",
            items: { type: "string", enum: tags.speed },
          },
          lang: {
            type: "string",
            description:
              "The lyrics language. We accept the standard 2 letters format. Use 'en' by default, unless the user specifies otherwise.",
          },
          durationbetween: {
            type: "string",
            description:
              "Track duration between values in seconds. This parameter need a value to be used for a between closed interval. The 'from' and 'to' parts are both mandatory, must be separated by an underscore ('_'), and must be both integer",
          },
          xartist: {
            type: "string",
            description:
              "Select tracks most similar to the declared NON-Jamendo artist",
          },
          // include: {
          //   type: "array",
          //   description:
          //     "With this special parameter you can append to the results some additional fields, not returned by default.",
          //   items: { type: "string", enum: tags.include },
          //   licensing: {
          //     type: "object",
          //     description: "Jamendo Licensing information",
          //     properties: {
          //       prolicensing: {
          //         type: "boolean",
          //         description:
          //           "Filter to get only tracks subscribed to our single track licensing commercial program",
          //       },
          //       probackground: {
          //         type: "boolean",
          //         description:
          //           "Filter to get only tracks subscribed to our background music commercial program",
          //       },
          //       ccsa: {
          //         type: "boolean",
          //         description:
          //           "Creative Commons Share Alike. Explicit this paramenter if you need to enforce some strict conditions on the type of license. For possible combinations with other types of licence check Creative Commons licenses",
          //       },
          //       ccnd: {
          //         type: "boolean",
          //         description:
          //           "Creative Commons No Derivs. Explicit this paramenter if you need to enforce some strict conditions on the type of license. For possible combinations with other types of licence check Creative Commons licenses",
          //       },
          //       ccnc: {
          //         type: "boolean",
          //         description:
          //           "Creative Commons Non Commercial. Explicit this paramenter if you need to enforce some strict conditions on the type of license. For possible combinations with other types of licence check Creative Commons licenses",
          //       },
          //     },
          //   },
          // },
          fuzzytags: {
            type: "object",
            description:
              "Search by one or more tags. We interpret this request as 'fuzzy'. Result with more corresponding tags will be ranked higher.",
            properties: {
              energy: {
                type: "array",
                items: { type: "string", enum: tags.energy },
              },
              mood: {
                type: "array",
                items: { type: "string", enum: tags.mood },
              },
              genres: {
                type: "array",
                items: { type: "string", enum: tags.genres },
              },
              instruments: {
                type: "array",
                items: { type: "string", enum: tags.instruments },
              },
            },
          },
          //required: [fuzzyTags], // fuzzyTags is required
          additionalProperties: false,
        },
      },
    },
  ];
  return tools;
}
