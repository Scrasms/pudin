import { Router } from "express";
import isAuth from "../middleware/isAuth.js";
import {
    chapterCreate,
    chapterDelete,
    chapterInfo,
    chapterLastRead,
    chapterLike,
    chapterUnlike,
    chapterUpdate,
} from "../controllers/chapterController.js";

const chapterRouter = Router({ mergeParams: true });

// Gets the user's last-read published chapter for a book
chapterRouter.get("/last", isAuth, chapterLastRead);

chapterRouter.post("/", isAuth, chapterCreate);

// Likes a published chapter
chapterRouter.post("/:number/like", isAuth, chapterLike);

// Unlikes a published chapter
chapterRouter.delete("/:number/like", isAuth, chapterUnlike);

// Updates a chapter's title, content and 'publish' status
chapterRouter.put("/:number", isAuth, chapterUpdate);

// Gets a published chapter, effectively 'reading' it
chapterRouter.get("/:number", chapterInfo);

chapterRouter.delete("/:number", isAuth, chapterDelete);

export { chapterRouter };
