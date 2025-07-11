import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
    console.log('working in verify token');
    // const token1 = req.headers.authorization?.split(" ")[1];
    console.log('cookies:', req.cookies);
    const token = req.cookies.accessToken;
    console.log('token with cookies is:', token);
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ msg: "Invalid token" });
    }
};

    export const verifyRole = (role) => (req, res, next) => {
    if (!req.user || req.user.role !== role) {
        return res.status(403).json({ msg: "Access denied" });
    }
    next();
};
