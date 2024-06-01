import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

// Importando o módulo 'express' para criar um roteador
const router = express.Router();

// Definindo uma rota POST '/register' no roteador
// /api/users/register
router.post(
  "/register",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").isLength({ min: 6 }),
    check("firstName", "First Name is required").isString(),
    check("lastName", "Last Name is required").isString(),
  ], // Validate the request body
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    } // Check for validation errors
    try {
      let user = await User.findOne({
        email: req.body.email,
      }); // Check if user already exists
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      user = new User(req.body); // Create a new user
      await user.save();

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string, // Generate JWT token
        {
          expiresIn: "1d", // 1 day
        }
      );

      res.cookie("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 86400000, // 1 day
      }); // Set the cookie in the response
      return res.status(201).json({ message: "User created successfully" }); // Send a success response
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// Exportando o roteador
export default router;
