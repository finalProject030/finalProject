// postRoute.js
import express from "express";
import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js"; // Import the Post model
import User from "../models/user.model.js"; // Import the User model
import { verifyToken } from "../utils/verifyUser.js"; // Import the verifyToken middleware

const router = express.Router();

// Middleware to parse JSON request bodies
router.use(express.json());

// Route handler to save a new post
router.post("/api/post", verifyToken, async (req, res, next) => {
  try {
    // Extract post data from request body
    console.log("req.body: " + req.body);

    const { title, content, author } = req.body;

    console.log("title: " + title);
    console.log("content: " + content);
    console.log("author: " + author);
    // Create a new post document
    const post = new Post({
      title,
      content,
      author,
    });
    console.log("post" + post);

    // Save the new post to the database
    const savedPost = await post.save();

    // Add the ObjectId of the new post to the user's posts array
    await User.findByIdAndUpdate(author, { $push: { posts: savedPost._id } });

    // Send the saved post as a response
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: savedPost,
    });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
});

export default router;
