import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json("User created successfully");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found!"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials!"));
    }
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;
    rest["token"] = token;
    res
      // .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      console.log(user);
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      rest["token"] = token;
      res
        // .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      rest["token"] = token;
      res
        // .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const facebook = async (req, res, next) => {
  try {
    const { name, email, photo } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // If the user doesn't exist, create a new user
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      user = new User({
        username:
          name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email,
        password: hashedPassword,
        avatar: photo,
      });
      await user.save();
    }

    // Sign a JWT token for the user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // Send the user data along with the token in the response
    const { password: pass, ...rest } = user._doc;
    rest["token"] = token;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    // res.clearCookie("access_token");
    res.status(200).json("User has been logged out");
  } catch (error) {
    next(error);
  }
};

export const requestPasswordReset = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(errorHandler(404, "User not found!"));
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "finalproject030@gmail.com",
        pass: process.env.EMAIL_TEST_APP_PASSWORD,
      },
    });

    const mailOptions = {
      to: user.email,
      from: "finalproject030@gmail.com",
      subject: "Password Reset",
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://localhost:5173/reset/${resetToken}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (error, response) => {
      if (error) {
        return next(error);
      }
      res.status(200).json("Password reset email sent");
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        errorHandler(400, "Password reset token is invalid or has expired.")
      );
    }

    user.password = bcryptjs.hashSync(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json("Password has been reset successfully");
  } catch (error) {
    next(error);
  }
};
