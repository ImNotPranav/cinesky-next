import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Favorite from "./models/Favorite.js";
import { authMiddleware } from "./middleware/auth.js";

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.log(error));

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

app.post("/auth/signup", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, passwordHash });
        return res.status(201).json({ message: "User created successfully", userId: user._id });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to create user" });
    }
})

app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "User not found" });
        }
        const token = jwt.sign(
            { userId: user._id, name: user.name, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json({ message: "User logged in successfully", userId: user._id, name: user.name });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to log in user" });
    }
})

app.post("/auth/logout", (req, res) => {
    res.clearCookie("token");
    return res.json({ message: "User logged out successfully" });
})

app.delete("/auth/account", authMiddleware, async (req, res) => {
    try {
        // Delete all user's favorites first
        await Favorite.deleteMany({ userId: req.user.userId });
        // Delete the user
        await User.findByIdAndDelete(req.user.userId);
        // Clear the auth cookie
        res.clearCookie("token");
        return res.json({ message: "Account deleted successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to delete account" });
    }
})

// Favorites endpoints (protected by auth)
app.get("/favorites", authMiddleware, async (req, res) => {
    try {
        const favorites = await Favorite.find({ userId: req.user.userId });
        return res.json(favorites);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to fetch favorites" });
    }
});

app.post("/favorites", authMiddleware, async (req, res) => {
    const { movieId, title, poster_path, vote_average } = req.body;
    if (!movieId || !title) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const favorite = await Favorite.create({
            userId: req.user.userId,
            movieId,
            title,
            poster_path,
            vote_average,
        });
        return res.status(201).json(favorite);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Movie already in favorites" });
        }
        console.log(error);
        return res.status(500).json({ message: "Failed to add favorite" });
    }
});

app.delete("/favorites/:movieId", authMiddleware, async (req, res) => {
    try {
        const result = await Favorite.findOneAndDelete({
            userId: req.user.userId,
            movieId: parseInt(req.params.movieId),
        });
        if (!result) {
            return res.status(404).json({ message: "Favorite not found" });
        }
        return res.json({ message: "Favorite removed" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to remove favorite" });
    }
});

app.listen(4000, () => console.log("API running on http://localhost:4000"));

