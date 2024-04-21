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
router.post("/", async(req, res, next) => {
  try {
    // console.log("im here!! ");
    // Extract post data from request body
    const { title, content, author } = req.body;

    // Create a new post document
    const post = new Post({
      title,
      content,
      author,
    });


    // Save the new post to the database
    const savedPost = await post.save();

    // Add the ObjectId of the new post to the user's posts array
    await User.findByIdAndUpdate(author, { $push: { posts: savedPost._id } });

    // Send the saved post as a response
    res.status(200).json({
      success: true,
      message: "Post created successfully",
      post: savedPost,
    });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
});

// Define the route handler to get user posts
router.get("/:userId", verifyToken, async (req, res, next) => {
  try {
    // Get the userId from the request params
    const userId = req.params.userId;

    // Query the database for posts belonging to the user
    const userPosts = await Post.find({ author: userId });

    // Send the user posts as a response
    res.status(200).json({
      success: true,
      message: "User posts retrieved successfully",
      posts: userPosts,
    });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
});

// Route handler to delete a post
// Route handler to delete a post
router.delete("/:postId", verifyToken, async (req, res, next) => {
  try {
    // Get the postId from the request params
    const postId = req.params.postId;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Delete the post from the database
    await Post.findByIdAndDelete(postId);

    // Remove the postId from the user's posts array
    await User.findByIdAndUpdate(post.author, { $pull: { posts: postId } });

    // Send success response
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
});

export default router;
