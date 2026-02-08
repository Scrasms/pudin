import { Router } from "express";
import isAuth from "../middleware/isAuth.js";
import {
    commentCreate,
    commentDelete,
    commentUpdate,
} from "../controllers/commentController.js";

const commentRouter = Router({ mergeParams: true });

commentRouter.post("/", isAuth, commentCreate);

// Updates the message body of a comment that the user wrote
commentRouter.put("/:cid", isAuth, commentUpdate);

// Deletes a comment that the user wrote
commentRouter.delete("/:cid", isAuth, commentDelete);

export { commentRouter };
