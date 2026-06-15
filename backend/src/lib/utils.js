import jwt from "jsonwebtoken";

export const generateWebToken = (userId,res) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET_KEY,{
        expiresIn: "7d"
    })
    
    res.cookie("jwt",token,{
        maxAge: 7*24*60*60*1000,
        httpOnly: true, // prevent XSS(cross site scripting) attacks
        sameSite: "strict", // prevent CSRF(cross-site request forgery) attacks
        secure: process.env.NODE_ENV !== 'development'
    })


    return token;
}