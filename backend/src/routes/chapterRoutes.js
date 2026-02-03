import { Router } from "express";
import isAuth from "../middleware/isAuth.js";
import {
    chapterCreate,
    chapterInfo,
    chapterLastRead,
    chapterUpdate,
} from "../controllers/chapterController.js";

const chapterRouter = Router({ mergeParams: true });

chapterRouter.get("/last", isAuth, chapterLastRead);

chapterRouter.post("/", isAuth, chapterCreate);

chapterRouter.put("/:number", isAuth, chapterUpdate);

chapterRouter.get("/:number", chapterInfo);

export { chapterRouter };
