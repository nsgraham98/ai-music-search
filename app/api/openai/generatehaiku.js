import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "sk-proj-YOUR-KEY-HERE", // 🔒 Best practice: use env variables instead
});

export async function getHaiku() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "Write a haiku about AI" }],
    });

    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error fetching haiku:", error);
  }
}

//getHaiku();
