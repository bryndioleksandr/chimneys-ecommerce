import User from "../models/user.js";
import bcrypt from 'bcrypt';
import err from "multer/lib/multer-error.js";

export const userRegister = async(req, res) => {
    try {
        const {name, surname, email, password} = req.body;

        const user = await User.exists({email: email});
        if (user) return res.json({msg: "This email is already in use"})

        const salt = await bcrypt.genSalt(10);
        const hashPw = await bcrypt.hash(password, salt);

        const newUser = new User(
            {
                name: name,
                surname: surname,
                email: email,
                password: hashPw
            }
        )

        await newUser.save();
        res.status(201).json({msg: "User registered successfully!"});
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
}

export const userLogin = async (req, res) => {
    const { email, password } = req.body;
    const user = User.findOne({where: email});
    if(!user) return res.status(404).json({ msg: "User not found" });
    const isMatchPassword = bcrypt.compare(password, user.password);
    if(!isMatchPassword) return res.status(404).json({ msg: "User not match" });
    else return res.status(200).json({msg: "User login successfully"});
}

