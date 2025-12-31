import Router from "express";
import passport from "passport";
import userController from "../controllers/userController.js";

const userRouter = Router();

// TODO: protect routes by writing custom auth middleware and checking req.isAuthenticated()

userRouter.post("/signup", userController.signup);

userRouter.post("/login", passport.authenticate("local"), userController.login);

userRouter.post("/logout", userController.logout);

userRouter.get("/:name", userController.testName);

userRouter.get("/", userController.test);

export default userRouter;
