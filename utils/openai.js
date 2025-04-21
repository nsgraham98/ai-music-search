import { OpenAI } from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getAIResults(userPrompt, trackList) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a music assistant helping users search for royalty-free tracks. Here is the track list: ${JSON.stringify(trackList)}`,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  return response.choices[0].message.content;
}
