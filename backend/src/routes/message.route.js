import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { getMessages, getUsersToChat, sendMessages } from "../controllers/message.controller.js";

const router = express.Router()

router.get("/users",protectRoute,getUsersToChat);
router.get("/:id",protectRoute,getMessages);
router.post("/send/:id",protectRoute,sendMessages);

export default router;