import { Router } from "express";
import isAuth from "../middleware/isAuth.js";
import {
    chapterCreate,
    chapterDelete,
    chapterInfo,
    chapterLastRead,
    chapterUpdate,
} from "../controllers/chapterController.js";

const chapterRouter = Router({ mergeParams: true });

chapterRouter.get("/last", isAuth, chapterLastRead);

chapterRouter.post("/", isAuth, chapterCreate);

chapterRouter.put("/:number", isAuth, chapterUpdate);

chapterRouter.get("/:number", chapterInfo);

chapterRouter.delete("/:number", isAuth, chapterDelete);

export { chapterRouter };
