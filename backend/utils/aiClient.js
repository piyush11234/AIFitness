// aiClient.js
import dotenv from "dotenv";
import { OpenRouter } from "@openrouter/sdk";

dotenv.config();

const client = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY || "YOUR_FALLBACK_KEY"
});

export const callDeepSeekAI = async (prompt) => {
  try {
    const response = await client.chat.send({
      model: "arcee-ai/trinity-mini:free", // ⭐ Best free stable model
      messages: [
        {
          role: "system",
          content: "You are a certified fitness and nutrition expert. Respond in JSON only when asked."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      stream: false, // disable streaming since we just need the final JSON
      temperature: 0.7,
      max_tokens: 2000
    });

    return response.choices?.[0]?.message?.content;

  } catch (err) {
    console.error("❌ AI Error:", err.response?.data || err.message);
    throw new Error("AI Request Failed");
  }
};
