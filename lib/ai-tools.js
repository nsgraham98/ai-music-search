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
      description: `You are a helpful assistant whose job is to parse the user's prompt and generate search parameters ("tags") for querying Jamendo's music database.

You will call the function searchJamendo(args) using the tags you identify from the user's input. The valid tags are provided to you — you must use the provided valid tags exactly as written (do not modify tag names or values).

Two notable parameters you can use are "tags" and "fuzzytags". They have identical structure, but different logic:
- "tags" must only be used when the user's prompt includes exact matches of the available tags. For example, if the user specifies "jazz" in their prompt, you should have "tags: ['jazz']" to search for it, because "jazz" exists in the available tags. This is a strict match.
- "fuzzytags" should be used for inferred or approximate matches.

Inclusion of some amount of "fuzzytags" is mandatory. If "tags" is allowed to be included, you must do so. Other tags are allowed but not necessary.
Use "tags" when appropriate; otherwise, default to "fuzzytags". Do not include both unless justified.

You must include at least 10 tags in your response, and you can be quite specific — the database is large.

Do not include song titles or artist names in your response — those will be handled by the Jamendo API results.`,

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
              "Search by one or more tags. We interpret this request as 'fuzzy'. These tags use the OR operator during search, for example: ( this_tag OR that_tag ). Result with more corresponding tags will be ranked higher.",
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
            description:
              "Search by one or more tags. These tags use the AND operator during search, for example: ( this_tag AND that_tag ). Result with more corresponding tags will be ranked higher.",
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
