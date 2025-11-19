// Tools to use with the OpenAI API
// Search tags, a description for the AI's job, the parameters it can use, etc.

import { readFile } from "fs/promises";
import path from "path";
import { deserialize } from "v8";

const loadTags = async () => {
  const tagsFilePath = path.join(
    process.cwd(),
    "/lib/search-data/search-tags.json"
  );
  const file = await readFile(tagsFilePath, "utf-8");
  const parsedFile = JSON.parse(file);
  return parsedFile;
};

export async function getTools() {
  const tags = await loadTags(); // Load the tags from the JSON file

  // Define the tools for the AI to use
  // The main tool is searchJamendo, which takes various parameters based on the tags
  // The AI's job is to parse the user's prompt and generate appropriate parameters for searching Jamendo's music database
  // It must use at least 10 tags, and include fuzzytags
  // It should use tags when there are exact matches in the user's prompt, otherwise default to fuzzytags
  // It should not include song titles or artist names in its response
  const tools = [
    {
      type: "function",
      name: "searchJamendo",
      description: `
You are a helpful assistant whose job is to parse the user's prompt and generate search parameters for querying Jamendo's music database.

- Use "tags" for strong, explicit constraints from the user (genre, mood, instruments they clearly state).
- Use "fuzzytags" for additional vibes, related genres, and softer preferences.
- It is OK to use both "tags" and "fuzzytags" together when justified.
- Do NOT guess values for acousticelectric, vocalinstrumental, gender, speed, or duration. Only include them when the user clearly specifies that preference.
- Do NOT include artist names or song titles.

Prefer 2-4 "tags" and up to 6-8 "fuzzytags". If the request is vague, fewer accurate tags are better than many guesses.

Example:
User: "lofi chill beats for studying, no vocals"
searchJamendo arguments:
{
  "vocalinstrumental": ["instrumental"],
  "fuzzytags": {
    "genres": ["hiphop"],
    "mood": ["chill", "calm"],
    "energy": ["low"]
  },
  "tags": {
    "genres": ["lofi"]
  }
}`,
      strict: false,
      parameters: {
        type: "object",
        additionalProperties: false,
        // required: ["fuzzytags"], // fuzzytags is required
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
            description:
              "Only include if the user specifies a preference either male OR female vocals. Otherwise omit this parameter, and both gender tracks will be included.",
            items: { type: "string", enum: tags.gender },
          },
          speed: {
            type: "array",
            description: "Tempo of the track.",
            items: { type: "string", enum: tags.speed },
          },
          lang: {
            type: "string",
            description:
              "If the user's language is clear (e.g. they write in French) or they mention a language, set lang accordingly. Otherwise, omit this parameter to include all languages.",
          },
          // durationbetween: {
          //   type: "string",
          //   description:
          //     "Track duration between values in seconds. This parameter need a value to be used for a between closed interval. The 'from' and 'to' parts are both mandatory, must be separated by an underscore ('_'), and must be both integer",
          // },
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
            additionalProperties: false,
            description:
              "Soft OR filters for energy, mood, genres, instruments. Use for vibes and broad matches.",
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
          tags: {
            type: "object",
            additionalProperties: false,
            description:
              "Hard AND filters for energy, mood, genres, instruments. Use for explicit constraints.",
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
          //required: [fuzzytags], // fuzzytags is required
        },
      },
    },
  ];

  return tools;
}


//alternative tools for spotify
// note: tags not needed unlike jamendo, spotify works with normal search queries.
export async function getSpotifyTools() {
  return [
    {
      type: "function",
      name: "searchSpotify",
      description: `You are a helpful assistant whose job is to parse the user's prompt and generate search parameters for querying Spotify's music database.

Unlike Jamendo's tag-based system, Spotify uses natural language search queries that can include:
- Artist names: "artist:Radiohead"
- Track names: "track:Bohemian Rhapsody" 
- Album names: "album:Dark Side of the Moon"
- Genres: "genre:jazz" or just "jazz"
- Years: "year:1990-2000"
- Descriptive terms: "sad slow songs", "upbeat rock", "chill electronic"

Generate 1-3 search queries that best capture the user's intent. Spotify's search is flexible - you can use natural language.`,
      parameters: {
        type: "object",
        properties: {
          queries: {
            type: "array",
            description:
              "1-3 search queries to use with Spotify's search API. Use natural language, artist names, track names, genres, years, etc.",
            items: { type: "string" },
            minItems: 1,
            maxItems: 3,
          },
          filters: {
            type: "object",
            description: "optional filters to apply",
            properties: {
              limit: {
                type: "number",
                description:
                  "Maximum number of results to return. Default is 20",
                default: 20,
              },
              market:{
                type: "string",
                description: "market/country code, e.g 'US',etc.",
                default: "US"
              }
            }
          }
        },
        required: ["queries"],
      }
    }
  ];
}
      