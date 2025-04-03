import User from "../models/user.js";
import bcrypt from 'bcrypt';
import err from "multer/lib/multer-error.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

export const userRegister = async(req, res) => {
    try {
        const {name, surname, email, password} = req.body;

        const user = await User.exists({email});
        if (user) return res.json({msg: "This email is already in use"})

        let role = "user";
        if(email === 's.v.bryndo@gmail.com') {
            role = "admin";
        }
        const salt = await bcrypt.genSalt(10);
        const hashPw = await bcrypt.hash(password, salt);

        const newUser = new User(
            {
                name: name,
                surname: surname,
                email: email,
                role: role,
                password: hashPw
            }
        )

        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({msg: "User registered successfully!", token});
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}


export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "User not found" });

        const isMatchPassword = await bcrypt.compare(password, user.password);
        if (!isMatchPassword) return res.status(400).json({ msg: "Invalid password" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ msg: "User login successfully", token });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

