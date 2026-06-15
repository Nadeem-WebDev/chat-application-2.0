import express from "express";
import http from "http";
import {Server} from "socket.io";


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

export function getReceiverSocketId(userId){
    return onlineSocketMap[userId];
}

// to store online users data
const onlineSocketMap = {};


io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if(userId) onlineSocketMap[userId] = socket.id;

    // io.emit() is used to send events to all the connected clients
    io.emit("getOnlineUsers",Object.keys(onlineSocketMap));

    console.log("user connected:",socket.id);

    socket.on("disconnect",()=>{
        delete onlineSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(onlineSocketMap));

        console.log("user disconnected:",socket.id);
    })
})




export {app, server, io};