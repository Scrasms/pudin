import Router from "express";
import userController from "../controllers/userController.js";

const userRouter = Router();

userRouter.get("/:name", userController.testName);

userRouter.get("/", userController.test);

export default userRouter;
