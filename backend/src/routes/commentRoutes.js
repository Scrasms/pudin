import { Router } from "express";
import isAuth from "../middleware/isAuth.js";
import { commentCreate } from "../controllers/commentController.js";

const commentRouter = Router({ mergeParams: true });

commentRouter.post("/", isAuth, commentCreate);

export { commentRouter };
