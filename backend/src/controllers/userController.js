import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import DBError from "../errors/DBError.js";
import AuthError from "../errors/AuthError.js";

const test = (req, res) => {
    return res.json({ success: true, message: `Hello ${req.user.username}!` });
};

const signup = async (req, res, next) => {
    const { email, password, username } = req.body;

    // TODO: input validation

    // Bcrypt automatically generates the salt
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await userModel.createUser(
            email,
            hashedPassword,
            username
        );

        // Login after signup
        req.login(user, (err) => {
            if (err) throw new AuthError();

            return res.json({ success: true });
        });

    } catch (err) {
        throw new DBError(err);
    }
};

const login = (req, res) => {
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

const logout = (req, res) => {
    req.logout((err) => {
        if (err) throw err;
        return res.json({ success: true });
    });
};

export default { test, signup, login, logout };
