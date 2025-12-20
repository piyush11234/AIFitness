import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

async function testFreeAI() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  // const apiKey= "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"
  
  if (!apiKey) {
    console.log("❌ ERROR: No OPENROUTER_API_KEY in .env file");
    console.log("👉 Get one from: https://openrouter.ai");
    return;
  }

  console.log("🧪 Testing OpenRouter free models...");
  
  // Try these models one by one
  const testModels = [
    "qwen/qwen2.5-32b-instruct:free",
    "google/gemma-2-9b-it:free", 
    "meta-llama/llama-3.2-3b-instruct:free",
    "microsoft/phi-3.5-mini-instruct:free"
  ];

  for (const model of testModels) {
    try {
      console.log(`\n🔍 Testing model: ${model}`);
      
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: model,
          messages: [{ role: "user", content: "Say 'Hello from Fitness AI!'" }],
          max_tokens: 50,
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:8000",
          },
          timeout: 10000,
        }
      );

      console.log(`✅ ${model} WORKS!`);
      console.log(`   Response: ${response.data.choices[0].message.content}`);
      console.log(`   ✅ Use this model in your aiClient.js`);
      return model; // Found working model
      
    } catch (error) {
      console.log(`❌ ${model} failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }
  
  console.log("\n😞 All free models failed. Possible issues:");
  console.log("1. Your API key might be invalid");
  console.log("2. You might need to add billing (still free tier)");
  console.log("3. Try getting a new key from openrouter.ai");
}

testFreeAI();