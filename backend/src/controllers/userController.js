import bcrypt from "bcryptjs";
import { createUser, deleteUser } from "../models/userModel.js";
import DBError from "../errors/DBError.js";
import passport from "passport";
import AuthError from "../errors/AuthError.js";

const userTest = (req, res) => {
    return res.json({ success: true, message: `Hello ${req.user.username}!` });
};

const userSignup = async (req, res, next) => {
    const { email, password, username } = req.body;

    // TODO: input validation (especially sending verification email)

    // Bcrypt automatically generates the salt
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const uid = await createUser(email, hashedPassword, username);

        const user = {
            uid: uid,
            username: username,
            password: password,
        };

        // Login after signup
        req.login(user, (err) => {
            if (err) return next(err);

            return res.json({ success: true });
        });
    } catch (err) {
        throw new DBError(err);
    }
};

const userLogin = (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) return next(err);
        if (!user) return next(new AuthError(info.message));

        req.login(user, (err) => {
            if (err) return next(err);

            return res.json({
                success: true,
                user: {
                    uid: user.uid,
                    email: user.email,
                    username: user.username,
                    image: user.profile_image,
                },
            });
        });
    })(req, res, next);
};

const userLogout = (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        return res.json({ success: true });
    });
};

// TODO: email verification before delete
const userDelete = async (req, res) => {
    const username = req.user.username;

    try {
        await deleteUser(username);
        return res.json({ success: true });
    } catch (err) {
        throw new DBError(err);
    }
};

export { userTest, userSignup, userLogin, userLogout, userDelete };
