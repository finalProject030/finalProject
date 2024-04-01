import express from "express";
import { pipeline } from "@xenova/transformers";

const router = express.Router();

// Define a handler function for the /textTransform route
router.post("/", async (req, res) => {
  try {
    // Perform the text transformation action
    const pipe = await pipeline("summarization");

    // Retrieve the article content from the request body
    const { article } = req.body;

    // Perform the summarization with desired options
    const result = await pipe(article, {
      max_length: 500,
      min_length: 100,
    });

    // Send the result as response
    res.json(result);
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
