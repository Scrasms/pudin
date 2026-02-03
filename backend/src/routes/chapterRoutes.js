import { Router } from "express";
import isAuth from "../middleware/isAuth.js";
import { chapterCreate, chapterUpdate } from "../controllers/chapterController.js";

const chapterRouter = Router({ mergeParams: true });

chapterRouter.post("/", isAuth, chapterCreate);

chapterRouter.put("/:number", isAuth, chapterUpdate);

export { chapterRouter };
