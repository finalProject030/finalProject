import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference the User model
      required: true,
    },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference the User model
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    isPublic: {
      type: Boolean,
      default: false,
      required: true,
    },
    likes: [likeSchema], // Array of likes\
  },

  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
