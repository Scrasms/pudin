import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";

const test = async (req, res) => {
    res.json({ message: "Hello World!" });
};

const testName = async (req, res) => {
    res.json({ message: `Hello ${req.params.name}!` });
};

const signup = async (req, res, next) => {
    try {
        const { email, password, username } = req.body;

        // Bcrypt automatically generates the salt
        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.createUser(email, hashedPassword, username);

        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res) => {
    const user = req.user;
    res.json({
        success: true,
        user: {
            uid: user.uid,
            email: user.email,
            username: user.username,
            image: user.profile_image
        }
    });
};

const logout = async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.json({ success: true });
    });
};

export default { test, testName, signup, login, logout };
