import User from "../models/user.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// export const verifyEmail = async (req, res) => {
//     try {
//         const { email, code } = req.body;
//
//         const user = await User.findOne({ email });
//         if (!user) return res.status(404).json({ msg: "User not found" });
//         if (user.isVerified) return res.json({ msg: "Email already verified" });
//
//         if (
//             user.emailVerificationCode === code &&
//             user.emailVerificationExpires > Date.now()
//         ) {
//             user.isVerified = true;
//             user.emailVerificationCode = undefined;
//             user.emailVerificationExpires = undefined;
//             await user.save();
//
//             return res.json({ msg: "Email verified successfully!" });
//         } else {
//             return res.status(400).json({ msg: "Invalid or expired verification code" });
//         }
//
//     } catch (err) {
//         res.status(500).json({ msg: err.message });
//     }
// };


// export const verifyEmail = async (req, res) => {
//     try {
//         const { email, code } = req.body;
//
//         const user = await User.findOne({ email });
//         if (!user) return res.status(404).json({ msg: "User not found" });
//         if (user.isVerified) return res.json({ msg: "Email already verified" });
//
//         if (
//             user.emailVerificationCode === code &&
//             user.emailVerificationExpires > Date.now()
//         ) {
//             user.isVerified = true;
//             user.emailVerificationCode = undefined;
//             user.emailVerificationExpires = undefined;
//             await user.save();
//
//             const accessToken = jwt.sign(
//                 { id: user._id, role: user.role },
//                 process.env.ACCESS_TOKEN_SECRET,
//                 { expiresIn: '15m' }
//             );
//             const refreshToken = jwt.sign(
//                 { id: user._id },
//                 process.env.REFRESH_TOKEN_SECRET,
//                 { expiresIn: '7d' }
//             );
//
//             return res.status(201).json({
//                 message: "Email verified successfully!",
//                 user: {
//                     id: user._id,
//                     name: user.name,
//                     surname: user.surname,
//                     email: user.email,
//                     role: user.role,
//                     accessToken,
//                     refreshToken,
//                 }
//             });
//         } else {
//             return res.status(400).json({ msg: "Invalid or expired verification code" });
//         }
//
//     } catch (err) {
//         return res.status(500).json({ msg: err.message });
//     }
// };

dotenv.config();

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

export const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ msg: "User not found" });
        if (user.isVerified) return res.json({ msg: "Email already verified" });

        if (user.emailVerificationCode === code && user.emailVerificationExpires > Date.now()) {
            user.isVerified = true;
            user.emailVerificationCode = undefined;
            user.emailVerificationExpires = undefined;
            await user.save();

            const payload = { _id: user._id, role: user.role };

            const accessToken = createAccessToken(payload);
            const refreshToken = createRefreshToken(payload);

            const cookieOptions = {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                path: '/'
            };

            res.cookie('accessToken', accessToken, cookieOptions);
            res.cookie('refreshToken', refreshToken, cookieOptions);

            return res.status(200).json({
                message: "Email verified successfully!",
                user: {
                    id: user._id,
                    name: user.name,
                    surname: user.surname,
                    email: user.email,
                    role: user.role,
                }
            });
        } else {
            return res.status(400).json({ msg: "Invalid or expired verification code" });
        }
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};
