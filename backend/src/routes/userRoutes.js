import Router from "express";
import isAuth from "../middleware/isAuth.js";
import { userTest, userSignup, userLogin, userLogout, userDelete } from "../controllers/userController.js";

const userRouter = Router();

userRouter.post("/signup", userSignup);

userRouter.post("/login", userLogin);

userRouter.post("/logout", isAuth, userLogout);

userRouter.post("/delete", isAuth, userDelete);

userRouter.get("/", isAuth, userTest);

export default userRouter;
