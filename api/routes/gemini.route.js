import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

// Route to handle incoming chat messages
router.post("/", async (req, res) => {
  try {
    const userMessage = req.body.message; // Assuming the message is sent in the 'message' property
    if (!userMessage) {
      throw new Error("Missing 'message' property in the request body");
    }

    // Call Google AI API to process the message
    const response = await processMessageToChatGemini(userMessage);

    // Send response back to the client
    res.status(200).json({ message: response });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function processMessageToChatGemini(userMessage) {
  try {
    // Access your API key as an environment variable
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate content based on the user message
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = await response.text();

    console.log(text);
    return text;
  } catch (error) {
    console.error("Error in processing message to Chat Gemini:", error);
    throw error;
  }
}

export default router;
