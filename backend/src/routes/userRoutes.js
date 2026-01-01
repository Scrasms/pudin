import Router from "express";
import isAuth from "../middleware/isAuth.js";
import { signup, login, logout, test } from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/signup", signup);

userRouter.post("/login", login);

userRouter.post("/logout", isAuth, logout);

userRouter.get("/", isAuth, test);

export default userRouter;
