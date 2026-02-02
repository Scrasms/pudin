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

// Get public information about all users
userRouter.get("/", userInfoAll);

// Get information about the books owned by the given user
userRouter.get("/:username/book", userBookInfo);

// Get public information about the given user
userRouter.get("/:username", userInfo);

export default userRouter;
