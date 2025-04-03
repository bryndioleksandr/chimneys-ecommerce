import { getUser } from "../controllers/authController.js";
import { verifyToken } from "../middleware/auth.js";
import express from "express";

const authRouter = express.Router();

authRouter.get("/user", verifyToken, getUser);

export default authRouter;
