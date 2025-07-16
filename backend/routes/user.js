import express from 'express';
import {userRegister, userLogin, refreshToken, userLogout} from "../controllers/user.js";
import cookieParser from "cookie-parser";
import {verifyToken} from "../middleware/auth.js";

const userRouter  = express.Router();

userRouter.post("/register", cookieParser(), userRegister);
userRouter.post("/login", cookieParser(), userLogin);
userRouter.post("/refreshToken", cookieParser(), refreshToken);
userRouter.get("/logout", userLogout);

export default userRouter;


