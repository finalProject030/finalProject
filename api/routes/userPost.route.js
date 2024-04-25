// postRoute.js
import express from "express";
import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js"; // Import the Post model
import User from "../models/user.model.js"; // Import the User model
import { verifyToken } from "../utils/verifyUser.js"; // Import the verifyToken middleware

const router = express.Router();

// Middleware to parse JSON request bodies
router.use(express.json());

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

// Route handler to update the visibility of a post
router.patch("/:postId/visibility", verifyToken, async (req, res, next) => {
  try {
    // Get the postId from the request params
    const postId = req.params.postId;

    // Get the new visibility from the request body
    const { isPublic } = req.body;

    // Find the post and update its visibility
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { isPublic },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Send success response with the updated post
    res.status(200).json({
      success: true,
      message: "Post visibility updated successfully",
      post: updatedPost,
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

// Define the route handler to get public posts
router.get("/public/posts", verifyToken, async (req, res, next) => {
  try {
    // Query for posts where isPublic exists and is true
    const publicPosts = await Post.find({
      isPublic: { $exists: true, $eq: true },
    });

    // Send the public posts as a response
    res.status(200).json({
      success: true,
      message: "Public posts retrieved successfully",
      posts: publicPosts,
    });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
});

// Define the route handler to get public posts
router.get("/public/postslikes", verifyToken, async (req, res, next) => {
  try {
    // Query for posts where isPublic exists and is true
    const publicPosts = await Post.find({
      isPublic: { $exists: true, $eq: true },
    });

    // Map through the public posts and count the number of likes for each post
    const postsWithLikes = await Promise.all(
      publicPosts.map(async (post) => {
        const likesCount = post.likes.length;
        return { ...post._doc, likesCount }; // Merge the original post data with the likesCount
      })
    );

    // Send the public posts with likes count as a response
    res.status(200).json({
      success: true,
      message: "Public posts retrieved successfully",
      posts: postsWithLikes,
    });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
});

// Route handler to save a new post
router.post("/", async (req, res, next) => {
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
    return res.status(200).json({
      success: true,
      message: "Post created successfully",
      post: savedPost,
    });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
});

// Route handler to like a post
router.post("/:postId/like", verifyToken, async (req, res, next) => {
  try {
    // Get the postId from the request params
    const postId = req.params.postId;

    // Get the user ID from the request token
    const userId = req.user.id;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if the user has already liked the post
    const alreadyLiked = post.likes.some((like) => like.user.equals(userId));
    if (alreadyLiked) {
      // If the user has already liked the post, return a success response
      return res.status(200).json({
        success: true,
        message: "You have already liked this post",
        post: post, // Return the post object
      });
    }

    // Add the user's like to the post
    post.likes.push({ user: userId });
    await post.save();

    // Send success response
    res.status(200).json({
      success: true,
      message: "You have liked the post",
      post: post,
    });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
});

// Route handler to remove a like from a post
router.post("/:postId/dislike", verifyToken, async (req, res, next) => {
  try {
    // Get the postId from the request params
    const postId = req.params.postId;

    // Get the current user ID from the verified token
    const userId = req.user.id;

    // Find the post by ID
    const post = await Post.findById(postId);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if the user has already liked the post
    const likedIndex = post.likes.findIndex(
      (like) => like.user.toString() === userId
    );

    // If the user has not liked the post, return an error
    if (likedIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "User has not liked this post",
      });
    }

    // Remove the like from the post
    post.likes.splice(likedIndex, 1);

    // Save the updated post
    await post.save();

    // Send success response
    res.status(200).json({
      success: true,
      message: "Like removed successfully",
      post: post,
    });
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
});

export default router;
