// chat.route.js

import express from "express";
const router = express.Router();
import dotenv from "dotenv";
dotenv.config();

// Route to handle incoming chat messages
router.post("/", async (req, res) => {
  try {
    const userMessage = req.body.userMessage;
    // Call OpenAI API to process the message
    const response = await processMessageToChatGPT(userMessage);
    // console.log(response);
    // Send response back to the client
    console.log(userMessage);

    res.status(200).json({ message: response });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function processMessageToChatGPT(userMessage) {
  // Call OpenAI API to process the message and return the response
  // This is where you would make your API call to OpenAI
  // Example code:
  const API_KEY = process.env.CHAT_API_KEY;
  const requestBody = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: userMessage }],
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();
  return data.choices[0].message.content;
}

export default router;
