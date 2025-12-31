import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";

// TODO: Update all to next(err) when error handler is written

const test = async (req, res) => {
    return res.json({ success: true, message: "Hello World!" });
};

const testName = async (req, res) => {
    return res.json({ success: true, message: `Hello ${req.params.name}!` });
};

const signup = async (req, res, next) => {
    try {
        const { email, password, username } = req.body;

        // TODO: input validation

        // Bcrypt automatically generates the salt
        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.createUser(email, hashedPassword, username);

        return res.json({ success: true });
    } catch (err) {
        return next(err);
    }
};

const login = async (req, res) => {
    const user = req.user;
    return res.json({
        success: true,
        user: {
            uid: user.uid,
            email: user.email,
            username: user.username,
            image: user.profile_image,
        },
    });
};

const logout = async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        return res.json({ success: true });
    });
};

export default { test, testName, signup, login, logout };
