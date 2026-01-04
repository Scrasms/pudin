import bcrypt from "bcryptjs";
import passport from "passport";
import {
    createUser,
    deleteUser,
    deleteUserSessions,
    createUserResetCodes,
} from "../models/userModel.js";
import { validatePassword } from "../utils/password.js";
import { generateResetCodes, hashResetCodes } from "../utils/reset.js";
import AuthError from "../errors/AuthError.js";
import DBError from "../errors/DBError.js";
import InputError from "../errors/InputError.js";

const userTest = (req, res) => {
    return res.json({
        success: true,
        data: {
            message: `Hello ${req.user.username}!`,
        },
    });
};

const userSignup = async (req, res, next) => {
    const { email, password, username } = req.body;

    //TODO: input validation (especially sending verification email)
    const err = validatePassword(password);
    if (err) {
        throw new InputError(err);
    }

    // Bcrypt automatically generates the salt
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const uid = await createUser(email, hashedPassword, username);

        const user = {
            uid: uid,
            username: username,
            password: password,
        };

        // Generate and store hashed password reset codes
        const codes = generateResetCodes(6);
        const hashedCodes = await hashResetCodes(codes);
        await createUserResetCodes(uid, hashedCodes);

        // Login after signup
        req.login(user, (err) => {
            if (err) return next(err);

            return res.json({
                success: true,
                data: {
                    codes: codes,
                },
            });
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
                data: {
                    user: {
                        uid: user.uid,
                        email: user.email,
                        username: user.username,
                        image: user.profile_image,
                    },
                },
            });
        });
    })(req, res, next);
};

const userLogout = (req, res) => {
    // Remove cookies and session (from DB) on logout
    req.logout(() => {
        req.session.destroy((err) => {
            if (err) return next(err);
            res.clearCookie("connect.sid");
            return res.json({ success: true });
        });
    });
};

// TODO: email verification before delete
const userDelete = async (req, res) => {
    const username = req.user.username;
    const uid = req.user.uid;

    try {
        await deleteUser(username);
        await deleteUserSessions(uid);
        return res.json({ success: true });
    } catch (err) {
        throw new DBError(err);
    }
};

export { userTest, userSignup, userLogin, userLogout, userDelete };
