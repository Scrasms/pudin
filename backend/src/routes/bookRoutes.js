import Router from "express";
import isAuth from "../middleware/isAuth.js";
import { bookCreate } from "../controllers/bookController.js";

const bookRouter = Router();

bookRouter.post("/", isAuth, bookCreate);

export default bookRouter;