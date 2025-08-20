import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
        console.log(error, "This error form register controller");
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 
        });

        res.status(200).json({ message: "Login successful", name: user.name });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
        console.log(error, "This error form login controller");
    }
}

export const me = async (req,res) =>{
    try {
        const user = await User.findById(req.user.id).select("-password"); // exclude password

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,     // include if you have roles
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
}