import express from "express";
import { signup, login, logout, updatePfp, userCheck } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

router.put("/update-profile", protectRoute, updatePfp)

router.get("/user-check", protectRoute, userCheck)

export default router;