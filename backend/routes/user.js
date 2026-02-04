import express from 'express';
import {userRegister, userLogin, refreshToken, userLogout} from "../controllers/user.js";
import cookieParser from "cookie-parser";
import {verifyToken} from "../middleware/auth.js";
import {loginSchema, registerSchema} from "../utils/validation.js";
import {validate} from "../middleware/validate.js";

const userRouter  = express.Router();

userRouter.post("/register", validate(registerSchema), userRegister);
userRouter.post("/login", validate(loginSchema), userLogin);
userRouter.post("/refreshToken", refreshToken);
userRouter.get("/logout", userLogout);

export default userRouter;


