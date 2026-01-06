import Router from "express";
import isAuth from "../middleware/isAuth.js";
import { bookCreate, bookDelete } from "../controllers/bookController.js";

const bookRouter = Router();

bookRouter.post("/", isAuth, bookCreate);
bookRouter.delete("/:bid", bookDelete);

export default bookRouter;