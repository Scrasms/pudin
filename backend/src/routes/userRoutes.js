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
} from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/signup", userSignup);

userRouter.post("/login", userLogin);

userRouter.post("/logout", isAuth, userLogout);

userRouter.delete("/delete", isAuth, userDelete);

userRouter.put("/password", isAuth, userPassword);

userRouter.put("/profile", isAuth, userProfile);

userRouter.get("/", isAuth, userTest);

export default userRouter;
