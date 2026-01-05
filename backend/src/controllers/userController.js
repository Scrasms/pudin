import bcrypt from "bcryptjs";
import passport from "passport";
import AuthError from "../errors/AuthError.js";
import DBError from "../errors/DBError.js";
import InputError from "../errors/InputError.js";
import { validatePassword } from "../utils/password.js";
import { uploadProfile } from "../utils/profile.js";
import {
    generateResetCodes,
    hashResetCodes,
    getMatchingResetCode,
} from "../utils/reset.js";
import {
    createUser,
    deleteUser,
    deleteUserSessions,
    createUserResetCodes,
    getUserResetCodes,
    deleteUserResetCode,
    updateUserPassword,
    updateUserProfile,
} from "../models/userModel.js";

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

const userPassword = async (req, res) => {
    const { newPassword, code } = req.body;
    const uid = req.user.uid;

    // Validate user's reset code
    const hashedCodes = await getUserResetCodes(uid);
    const hashedCode = await getMatchingResetCode(hashedCodes, code);
    if (!hashedCode) {
        throw new AuthError("Password reset code is incorrect");
    }

    // Ensure new password is not the same as the old password
    const match = await bcrypt.compare(newPassword, req.user.password);
    if (match) {
        throw new InputError(
            "New password cannot be the same as the old password"
        );
    }

    try {
        // Update user's password and invalidate the used reset code
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await updateUserPassword(uid, hashedPassword);
        await deleteUserResetCode(uid, hashedCode);

        // Logout the user on all devices (delete all sessions)
        await deleteUserSessions(uid);

        return res.json({ success: true });
    } catch (err) {
        throw new DBError(err);
    }
};

const userProfile = async (req, res) => {
    const { newProfile } = req.body;
    const uid = req.user.uid;

    // Upload new image
    const data = await uploadProfile(uid, newProfile);
    if (!data.success) {
        throw new InputError(data.error.message);
    }

    // Store new image link in DB
    try {
        await updateUserProfile(uid, data.data.url);
    } catch (err) {
        throw new DBError(err);
    }

    res.json({ success: true });
};

export {
    userTest,
    userSignup,
    userLogin,
    userLogout,
    userDelete,
    userPassword,
    userProfile,
};
