import { readFileSync } from "fs";
import path from "path";

// temporary testing solution
const tagsFilePath = path.join(process.cwd(), "public/assets/search-tags.json");
const fileContent = readFileSync(tagsFilePath, "utf-8");
const tags = JSON.parse(fileContent);

export const tools = [
  {
    type: "function",
    name: "searchJamendo",
    description:
      "Generate a string of search parameters for the Jamendo API call. We pass the search parameters to the function as an object and it returns a url to the Jamendo API with the search parameters included. All parameters are optional except fuzzytags.",
    strict: false,
    parameters: {
      type: "object",
      properties: {
        acousticelectric: {
          type: "array",
          items: { type: "string", enum: tags.acousticelectric },
        },
        vocalinstrumental: {
          type: "array",
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
            "The lyrics language. We accept the standard 2 letters format",
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
            "Search by one or more tags. We interpret this request as fuzzy. Result with more corresponding tags will be ranked higher.",
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
