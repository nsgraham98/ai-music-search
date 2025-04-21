import { getAIResults } from "@/utils/openai";
import tracks from "@/TestTracks.json";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { prompt } = req.body;

  try {
    const aiResponse = await getAIResults(prompt, tracks);
    res.status(200).json(aiResponse);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to process AI search" });
  }
}
