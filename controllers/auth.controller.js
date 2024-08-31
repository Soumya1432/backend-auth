import { User } from "../models/user.model.js";
import crypto from "crypto";
import bcryptjs from "bcryptjs";
import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail
} from "../mailtrap/emails.js";


//signup functionality
export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input fields
    if (!email || !password || !name) {
      return res.status(400).json({
        message: "All fields are required",
        success: false
      });
    }

    // Check if user already exists
    const userAlreadyExist = await User.findOne({ email });
    if (userAlreadyExist) {
      return res.status(400).json({
        message: "User already exists",
        success: false
      });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Create new user
    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });

    await user.save();

    // Generate JWT token and set cookie
    await generateTokenAndSetCookie(res, user._id); // Use user._id here
    await sendVerificationEmail(user.email, verificationToken);
    // Send success response
    res.status(201).json({
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined // Remove the password from the response
      }
    });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};

//verify-email
export const verifyEmail = async (req, res) => {
  //1 2 3 4 5 6
  const { code } = req.body;
  try {
    //fist we need that user to verify their email
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification code",
        success: false
      });
    }
    //user verified check true or false
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, user.name);
    return res.status(200).json({
      message: "Token verify successfully",
      user: {
        ...user._doc,
        password: undefined
      }
    });
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false
      });
    }

    const isPassWordValid = await bcryptjs.compare(password, user.password);
    if (!isPassWordValid) {
      return res.status(400).json({
        message: "Invalid password",
        success: false
      });
    }
    generateTokenAndSetCookie(res, user._id);
    user.lastlogin = new Date();
    await user.save();
    res.status(200).json({
      message: "Log in successfully",
      user: {
        ...user._doc,
        password: undefined
      },
      success: true
    });
  } catch (error) {
    console.log("Error", error);
    res.status(400).json({
      message: error.message,
      success: false
    });
  }
};

//forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }
    //generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //1 hour
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();
    //sending mail for reset password url
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );
    res.status(200).json({
      message: "Reset email successfully sent to your email",
      success: true
    });
  } catch (error) {
    console.log("Error", error);
    res.status(400).json({
      message: "Password not reset",
      success: false
    });
  }
};

//logout
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Logout successfully",
    success: true
  });
};

//reset password which auto generated
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token"
      });
    }
    //update password
    const hashedPassword = await bcryptjs.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    await sendResetSuccessEmail(user.email);
    res.status(200).json({
      message: "Password reset successfull",
      success: true
    });
  } catch (error) {
    console.log("Error", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

//check authenticaed or not that which user sign up or sign in
export const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      });
    }
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.log("Error in checkauth", error);
    res.status(400).json({
      message: error.message,
      success: false
    });
  }
};
