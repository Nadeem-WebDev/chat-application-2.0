import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const protectRoute = async(req, res, next) =>{
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({message:"Unauthorized User - No token provided"});
        }

        const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY);

        if (!decodedToken) {
            return res.status(401).json({message:"Unauthorized User - Invalid token provided"});
        }

        const user = await User.findById(decodedToken.userId).select("-password");

        if (!user) {
            return res.status(401).json({message:"User Not Found"});
        }

        req.user = user;

        next();
    } catch (error) {
        console.log(`Error on middleware: ${error.message}`);
        res.status(500).json({ message:"Internal Server Error" })
    }
}