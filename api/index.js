import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"; // Import cors package
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import chatRouter from "./routes/chat.route.js";
import tranformTextRouter from "./routes/transformText.route.js";
import geminiRouter from "./routes/gemini.route.js";
import cookieParser from "cookie-parser";
import userPostsRouter from "./routes/userPost.route.js";
import axios from "axios";
import path from "path";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*", // Allow requests from this specific origin
  })
);

// Use your routers
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
app.use("/api/chat", chatRouter);
app.use("/api/transformText", tranformTextRouter);
app.use("/api/gemini", geminiRouter);
app.use("/api/post", userPostsRouter);

// Serve static files
app.use(express.static(path.join(__dirname, "/client/dist")));

// Fallback route for client-side routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Listen on the defined port or default to 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});

// app.get('/posts', async (req, res) => {
//   console.log("im here!!!!");
// const { sort, order, questionId } = req.query;
// let api;

// console.log(req.query);

// if (sort !== "relevance") {
//   api = `https://api.stackexchange.com/2.3/questions/${questionId}/answers?order=${order}&sort=${sort}&site=stackoverflow&filter=!6WPIomnMOOD*e`;
// } else {
//   api = `https://api.stackexchange.com/2.3/search/advanced?order=desc&sort=votes&title=react&site=stackoverflow&filter=!6WPIomnMOOD*e`;
// }

// try {
//   const response = await axios.get(api);
//   res.json(response.data);
// } catch (error) {
//   console.error("Error fetching data from Stack Exchange API:", error);
//   res.status(500).json({ error: "Internal server error" });
// }
// });
