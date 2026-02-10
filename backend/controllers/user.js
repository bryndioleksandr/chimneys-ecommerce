import User from "../models/user.js";
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import crypto from 'node:crypto';

dotenv.config();

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

// export const userRegister = async(req, res) => {
//     try {
//         const {name, surname, email, password} = req.body;
//
//         const user = await User.exists({email});
//         if (user) return res.json({msg: "This email is already in use"})
//
//         let role = "user";
//         if(email === 's.v.bryndo@gmail.com') {
//             role = "admin";
//         }
//         const salt = await bcrypt.genSalt(10);
//         const hashPw = await bcrypt.hash(password, salt);
//
//         const newUser = new User(
//             {
//                 name: name,
//                 surname: surname,
//                 email: email,
//                 role: role,
//                 password: hashPw
//             }
//         )
//
//         await newUser.save();
//
//         const accessToken = createAccessToken({_id: newUser._id});
//         const refreshToken = createRefreshToken({_id: newUser._id});
//         res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'lax' });
//         res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'lax' });
//
//         console.log("Відповідь з сервера:", {
//             message: "User registered successfully!",
//             accessToken,
//             refreshToken,
//             user: {
//                 id: newUser._id,
//                 name: newUser.name,
//                 email: newUser.email,
//                 role: newUser.role
//             }
//         });
//
//         res.status(201).json({
//             message: "User registered successfully!",
//             user: {
//                 id: newUser._id,
//                 name: newUser.name,
//                 email: newUser.email,
//                 role: newUser.role,
//                 accessToken,
//                 refreshToken,
//             }
//         });
//     } catch (err) {
//         return res.status(500).json({ msg: err.message });
//     }
// }

import {sendVerificationEmail} from '../services/emailService.js';
import {Resend} from "resend";

export const userRegister = async (req, res) => {
    try {
        const {name, surname, email, password} = req.body;


        const userExists = await User.exists({email});
        if (userExists) {
            return res.status(409).json({msg: "Цей email вже використовується"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashPw = await bcrypt.hash(password, salt);

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new User({
            name,
            surname,
            email,
            role: 'user',
            password: hashPw,
            emailVerificationCode: verificationCode,
            emailVerificationExpires: Date.now() + 10 * 60 * 1000
        });

        await newUser.save();

        await sendVerificationEmail(email, verificationCode);

        return res.status(201).json({
            message: "Verification code sent to email. Please verify to complete registration."
        });

    } catch (err) {
        return res.status(500).json({msg: err.message});
    }
};

export const resendVerificationCode = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ msg: "Email is required" });
        }
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        user.emailVerificationCode = verificationCode;
        user.emailVerificationExpires = Date.now() + 10 * 60 * 1000;
        await user.save();
        await sendVerificationEmail(email, verificationCode);
        return res.status(200).json({ msg: "Verification code resent successfully" });
    }
    catch(e) {
        console.error("Resend code error:", e);
        return res.status(500).json({msg: e.message});
    }

}

export const refreshToken = async (req, res) => {
    try {

        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({msg: "Помилка оновлення токена. Refresh token відсутній"});
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({message: "Refresh token прострочений"});
                }
                return res.status(401).json({message: "Invalid refresh token"});
            }
            const foundUser = await User.findById(decoded._id);
            if (!foundUser) return res.status(401).json({message: "User not found"});

            const payload = {_id: foundUser._id, role: foundUser.role}
            const accessToken = createAccessToken(payload);
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/',
            });

            return res.status(200).json({msg: 'Token updated successful'});
        });

    } catch (error) {
        console.error('Помилка перевірки або оновлення токена:', error);
        return res.status(500).json({msg: 'Помилка сервера при оновленні токена'});
    }
};


export const userLogin = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if (!user) return res.status(404).json({msg: "User not found"});

        if (!user.isVerified) {
            return res.status(401).json({msg: "Email not verified. Please check your inbox."});
        }

        const isMatchPassword = await bcrypt.compare(password, user.password);
        if (!isMatchPassword) return res.status(400).json({msg: "Invalid password"});

        const payload = {_id: user._id, role: user.role}

        const accessToken = createAccessToken(payload);
        const refreshToken = createRefreshToken(payload);
        res.cookie('accessToken', accessToken, {httpOnly: true, secure: false, sameSite: 'lax'});
        res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: false, sameSite: 'lax'});

        res.status(200).json({
            message: "User login successfully!",
            user: {
                id: user._id,
                name: user.name,
                surname: user.surname,
                email: user.email,
                role: user.role,
            }
        });
    } catch (err) {
        res.status(500).json({msg: err.message});
    }
};

export const userLogout = async (req, res) => {
    try {
        res.clearCookie('accessToken', {sameSite: "none", secure: true});
        res.clearCookie('refreshToken', {sameSite: "none", secure: true});
        res.status(200).json({msg: 'Logout completed'});
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

const resend = new Resend(process.env.RESEND_URL);


export const resetUserPassword = async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email: email});
    if (!user) return res.status(404).json({msg: `User ${email} not found`});

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordExpire = Date.now() + 3600000;
    try {
        user.resetToken = resetToken;
        user.resetPasswordExpire = resetPasswordExpire;
        await user.save();
        const resetUrl = `https://www.dymohit.com.ua/reset-password/${resetToken}`;
        await resend.emails.send({
            from: 'ДимоHIT <noreply@dymohit.com.ua>',
            to: [user.email],
            subject: 'Відновлення пароля',
            html: `<p>Для зміни пароля перейдіть за посиланням: <a href="${resetUrl}">${resetUrl}</a></p>`
        });
        return res.status(200).json({});
    } catch (err) {
        return res.status(500).json({msg: err.message});
    }
}

export const updatePassword = async (req, res) => {
    try {
        const {token} = req.params;
        const {password} = req.body;
        const user = await User.findOne({
            resetToken: token,
            resetPasswordExpire: {$gt: Date.now()}
        });

        if (!user) {
            return res.status(400).json({msg: "Токен недійсний або його термін дії закінчився"});
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        user.resetToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({msg: "Пароль успішно оновлено"});
    } catch (err) {
        console.error("Error resetting password:", err);
        res.status(500).json({msg: "Помилка сервера"});
    }
}

