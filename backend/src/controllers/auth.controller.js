import cloudinary from "../lib/cloudinary.js";
import { generateWebToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) =>{
    const {fullName,email,password} = req.body;
    
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required"} )      
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be atleast 8 characters" });
        }
        
        const user = await User.findOne({email});
        
        if (user) {
            return res.status(400).json({ message: "User with this email id already exists" });
        }

        // hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            email,
            fullName,
            password: hashPassword
        })

        if (newUser) {
            // generate jwt token
            generateWebToken(newUser._id,res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                name: newUser.fullName
            })
            
        } else {
            res.status(400).json({ message: "invalid user data" });
        }




    } catch (error) {
        console.log(`Error occurred while signing up: ${error.message}`);
        res.status(500).json({ message:"Internal Server Error" })
    }

}

export const login = async(req, res) =>{
    const {email,password} = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required"} )      
        }

        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({message:"Invalid credentials"});
        }

        const isPwdCorrect = await bcrypt.compare(password,user.password);
        if (!isPwdCorrect) {
            return res.status(400).json({message:"Invalid credentials"});
        }

        generateWebToken(user._id,res);

        res.status(201).json({
            _id: user._id,
            name: user.fullName
        })

    } catch (error) {
        res.status(500).json({ message:"Internal Server Error" })
        console.log(`Error occurred while logging in: ${error.message}`);

    }
}

export const logout = (req, res) =>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"logged out successfully"})
    } catch (error) {
        console.log(`Error occurred while logging out: ${error.message}`);
        res.status(500).json({ message:"Internal Server Error" })
    }
}


export const updatePfp = async(req,res)=>{
    try {
        const { pfp } = req.body;
        if (!pfp) {
            res.status(401).json({message:"profile picture not found"})
        }
        const userId = req.user._id;
        const uploadResponse = await cloudinary.uploader.upload(pfp);
        const updatedUser = await User.findByIdAndUpdate(userId, {pfp: uploadResponse.secure_url}, {new:true}).select("-password");

        res.status(200).json(updatedUser);
    } catch (error) {
        console.log(`Error occurred while updating pfp: ${error.message}`);
        res.status(500).json({ message:"Internal Server Error" })
    }
}


export const userCheck = (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log(`Error occurred while checking authentication of user: ${error.message}`);
        res.status(500).json({ message:"Internal Server Error" })
    }
}