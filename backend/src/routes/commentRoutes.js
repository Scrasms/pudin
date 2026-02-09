import { Router } from "express";
import isAuth from "../middleware/isAuth.js";
import {
    commentCreate,
    commentDelete,
    commentInfo,
    commentReplyInfo,
    commentUpdate,
} from "../controllers/commentController.js";

const commentRouter = Router({ mergeParams: true });

commentRouter.post("/", isAuth, commentCreate);

// Gets all top-level comments of the chapter
commentRouter.get("/", commentInfo);

// Gets all replies to a comment
commentRouter.get("/:cid", commentReplyInfo);

// Updates the message body of a comment that the user wrote
commentRouter.put("/:cid", isAuth, commentUpdate);

// Deletes a comment that the user wrote
commentRouter.delete("/:cid", isAuth, commentDelete);

export { commentRouter };
