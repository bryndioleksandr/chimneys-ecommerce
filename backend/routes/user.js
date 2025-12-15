import express from 'express';
import {userRegister, userLogin, refreshToken, userLogout} from "../controllers/user.js";
import cookieParser from "cookie-parser";
import {verifyToken} from "../middleware/auth.js";

const userRouter  = express.Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.post("/refreshToken", refreshToken);
userRouter.get("/logout", userLogout);

export default userRouter;


