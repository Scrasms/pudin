import Router from "express";
import passport from "passport";
import isAuth from "../middleware/isAuth.js";
import userController from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/signup", userController.signup);

userRouter.post("/login", passport.authenticate("local"), userController.login);

userRouter.post("/logout", isAuth, userController.logout);

userRouter.get("/", isAuth, userController.test);

export default userRouter;
