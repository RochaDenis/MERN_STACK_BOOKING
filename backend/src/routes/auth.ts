import express, { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters  required").isLength({
      min: 6,
    }),
  ],// Validate the request body

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    } // Check for validation errors

    const { email, password } = req.body; // Destructure email and password from the request body

    try {
      const user = await User.findOne({
        email,
      }); // Find the user by email

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      } // Check if user exists

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      } // Check if password is correct

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
      ); // Generate JWT token

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000,
      }); 
      res.status(200).json({ userId: user._id });
      // Set the cookie in the response
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }   // Send a success response
  }
); 

export default router;
