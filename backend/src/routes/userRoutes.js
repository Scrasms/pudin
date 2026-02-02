import Router from "express";
import isAuth from "../middleware/isAuth.js";
import {
    userTest,
    userSignup,
    userLogin,
    userLogout,
    userDelete,
    userPassword,
    userProfile,
    userInfo,
    userBookInfo,
    userInfoAll,
    userBookSave,
    userBookSaveInfo,
    userBookSaveInfoAll,
    userBookSaveUpdate,
    userBookSaveDelete,
} from "../controllers/userController.js";

const userRouter = Router();

// Test route that only works if user is authenticated
userRouter.get("/test", isAuth, userTest);

userRouter.post("/signup", userSignup);

userRouter.post("/login", userLogin);

userRouter.post("/logout", isAuth, userLogout);

userRouter.post("/delete", isAuth, userDelete);

// Update user's password
userRouter.post("/password", isAuth, userPassword);

// Update user's profile picture
userRouter.put("/profile", isAuth, userProfile);

// Saves a book for the user with default status "unread"
userRouter.post("/save/:bid", isAuth, userBookSave);

// Get information about a user's specified saved book
userRouter.get("/save/:bid", isAuth, userBookSaveInfo);

// Updates the status of the user's saved book
userRouter.put("/save/:bid", isAuth, userBookSaveUpdate);

// Unsaves a book for the user
userRouter.delete("/save/:bid", isAuth, userBookSaveDelete);

// Get information about all of a user's saved books
userRouter.get("/save", isAuth, userBookSaveInfoAll);

// Get public information about all users
userRouter.get("/", userInfoAll);

// Get information about the books owned by the given user
userRouter.get("/:username/book", userBookInfo);

// Get public information about the given user
userRouter.get("/:username", userInfo);

export default userRouter;
