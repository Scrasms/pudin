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
} from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/signup", userSignup);

userRouter.post("/login", userLogin);

userRouter.post("/logout", isAuth, userLogout);

userRouter.post("/delete", isAuth, userDelete);

userRouter.post("/password", isAuth, userPassword);

userRouter.put("/profile", isAuth, userProfile);

userRouter.get("/", isAuth, userTest);

userRouter.get("/:username", userInfo);

export default userRouter;
