import Router from "express";
import isAuth from "../middleware/isAuth.js";
import { tagCreate } from "../controllers/tagController.js";

const tagRouter = Router();

tagRouter.post("/", isAuth, tagCreate);

export default tagRouter;
