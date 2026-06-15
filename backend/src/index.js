import express from 'express'
import cookieParser from 'cookie-parser'
import cors from "cors"
import dotenv from "dotenv"
import path from "path"


import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import { connectDB } from './lib/db.js'
import { app, server } from './lib/socket.js'


dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();


// cors permission
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname,"../frontend/dist")))
    app.get(/(.*)/  , (req, res)=>{
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
    })
}

server.listen(PORT, () => {
    console.log(`server is runing on port ${PORT}`);
    connectDB();
})