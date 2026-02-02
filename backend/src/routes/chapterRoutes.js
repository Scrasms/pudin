import { Router } from "express";
import isAuth from "../middleware/isAuth.js";
import { chapterCreate } from "../controllers/chapterController.js";

const chapterRouter = Router({ mergeParams: true });

chapterRouter.post("/", isAuth, chapterCreate);

export { chapterRouter };
