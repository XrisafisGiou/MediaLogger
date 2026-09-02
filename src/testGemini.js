import "dotenv/config";

import aiService from "./services/aiService.js";

async function testGemini() {
  try {
    console.log("Sending request...");

    console.time("gemini");

    const response = await aiService.chat(
      "Recommend one science fiction movie. Keep the answer to one sentence.",
    );

    console.timeEnd("gemini");

    console.log("Response:");
    console.log(response);
  } catch (error) {
    console.error("Gemini test failed:");
    console.error(error);
  }
}

testGemini();