import bcrypt from "bcryptjs";
import passport from "passport";
import AuthError from "../errors/AuthError.js";
import DBError from "../errors/DBError.js";
import InputError from "../errors/InputError.js";
import { bannedNames } from "../constants/bannedNames.js";
import { validatePassword } from "../utils/password.js";
import { uploadImage } from "../utils/image.js";
import {
    generateResetCodes,
    hashResetCodes,
    getMatchingResetCode,
} from "../utils/reset.js";
import {
    getUserByUsername,
    createUser,
    deleteUser,
    deleteUserSessions,
    createUserResetCodes,
    getUserResetCodes,
    deleteUserResetCode,
    updateUserPassword,
    updateUserProfile,
    getAllUsers,
} from "../models/userModel.js";
import { getBooksByUser } from "../models/bookModel.js";
import { wrapBookData } from "../utils/wrapBook.js";

const userTest = (req, res) => {
    return res.json({
        success: true,
        data: {
            message: `Hello ${req.user.username}!`,
        },
    });
};

const userSignup = async (req, res, next) => {
    let { email, password, username } = req.body;

    //TODO: input validation (especially sending verification email)
    username = username.trim();
    if (bannedNames.includes(username)) {
        throw new InputError("Username is not allowed");
    }

    email = email.trim();

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

            const userData = { uid: user.uid };

            return res.status(201).json({
                success: true,
                data: {
                    user: userData,
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

            const userData = { uid: user.uid };

            return res.json({
                success: true,
                data: {
                    user: userData,
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
        let success = await deleteUser(username);
        if (!success) {
            throw new InputError("User not found");
        }
        success = await deleteUserSessions(uid);
        if (!success) {
            throw new InputError("No sessions found belonging to user");
        }
        return res.json({ success: true });
    } catch (err) {
        throw new DBError(err);
    }
};

const userPassword = async (req, res) => {
    const { password, code } = req.body;
    const uid = req.user.uid;
    const oldPassword = req.user.password;

    // Validate user's reset code
    const hashedCodes = await getUserResetCodes(uid);
    const hashedCode = await getMatchingResetCode(hashedCodes, code);
    if (!hashedCode) {
        throw new AuthError(
            "Password reset code is incorrect or has already been used",
        );
    }

    // Ensure new password is valid
    const err = validatePassword(password);
    if (err) {
        throw new InputError(err);
    }

    // Ensure new password is not the same as the old password
    const match = await bcrypt.compare(password, oldPassword);
    if (match) {
        throw new InputError(
            "New password cannot be the same as the old password",
        );
    }

    try {
        // Update user's password and invalidate the used reset code
        const hashedPassword = await bcrypt.hash(password, 10);
        await updateUserPassword(uid, hashedPassword);
        let success = await deleteUserResetCode(uid, hashedCode);
        if (!success) {
            throw new InputError("No such reset code found belonging to user");
        }

        // Logout the user on all devices (delete all sessions)
        success = await deleteUserSessions(uid);
        if (!success) {
            throw new InputError("No sessions found belonging to user");
        }

        return res.json({ success: true });
    } catch (err) {
        throw new DBError(err);
    }
};

const userProfile = async (req, res) => {
    const { profile } = req.body;
    const uid = req.user.uid;

    // Upload new image
    const data = await uploadImage(uid, profile);
    if (!data.success) {
        throw new InputError(data.error.message);
    }

    // Store new image link in DB
    try {
        const link = data.data.url;
        await updateUserProfile(uid, link);

        const userData = { image: link };
        res.json({
            success: true,
            data: {
                user: userData,
            },
        });
    } catch (err) {
        throw new DBError(err);
    }
};

const userInfo = async (req, res) => {
    const username = req.params.username.trim();

    const user = await getUserByUsername(username);
    if (!user) {
        throw new InputError("Username not found");
    }

    const userData = {
        uid: user.uid,
        email: user.email,
        username: user.username,
        image: user.profile_image,
        joined_at: user.joined_at,
    };

    res.json({
        success: true,
        data: {
            user: userData,
        },
    });
};

const userInfoAll = async (req, res) => {
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const searchQuery = req.query.searchQuery;

    const allUsersData = await getAllUsers(limit, offset, searchQuery);

    res.json({
        success: true,
        data: {
            users: allUsersData,
        },
    });
};

const userBookInfo = async (req, res) => {
    const username = req.params.username.trim();

    const user = await getUserByUsername(username);
    if (!user) {
        throw new InputError("Username not found");
    }

    // Restrict search to published books if user is not searching for their own books
    let publishedOnly = true;
    if (req.user) {
        publishedOnly = username !== req.user.username;
    }
    const userBooksData = [];

    // Wrap bookData with user, chapter and tag information
    const data = await getBooksByUser(user.uid, publishedOnly);
    for (const bookData of data) {
        const wrappedBookData = await wrapBookData(
            req.user,
            bookData,
            publishedOnly,
        );
        userBooksData.push(wrappedBookData);
    }

    res.json({
        success: true,
        data: {
            books: userBooksData,
        },
    });
};

export {
    userTest,
    userSignup,
    userLogin,
    userLogout,
    userDelete,
    userPassword,
    userProfile,
    userInfo,
    userInfoAll,
    userBookInfo,
};
