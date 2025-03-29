const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = "AIzaSyAmLnUVS6dlSyWD4fF2o0eALZyUz3vZvjQ";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

export async function keywords(description) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(
      `Based on the following job description: "${description}", extract key technical terms such as tech stack, years of experience, and relevant skills, language used. Output an array of important keywords only.`
    );

    const textResponse = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const extractedKeywords = textResponse.match(/\[.*\]/);

    console.log("Extracted Keywords:", extractedKeywords);
    return extractedKeywords ? JSON.parse(extractedKeywords[0]) : [];
  } catch (error) {
    console.error("Error extracting keywords:", error);
    return [];
  }
}