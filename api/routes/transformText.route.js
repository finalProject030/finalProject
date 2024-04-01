import express from "express";
import { pipeline } from "@xenova/transformers";

const router = express.Router();

// Define a handler function for the /textTransform route
router.post("/", async (req, res) => {
  try {
    console.log(req.body);

    // Perform the text transformation action
    const pipe = await pipeline("summarization");

    // Retrieve the article content from the request body
    const { article } = req.body;
    console.log("article: " + article);

    // Perform the summarization with desired options
    const result = await pipe(article, {
      max_length: 1500,
      min_length: 100,
    });
    console.log("result: " + result);

    // Send the result as response
    res.send(result); // Assuming summary_text contains the desired text
  } catch (error) {
    // Handle errors
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
