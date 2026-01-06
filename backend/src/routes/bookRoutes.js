import Router from "express";
import isAuth from "../middleware/isAuth.js";
import {
    bookCreate,
    bookInfo,
    bookInfoAll,
    bookDelete,
} from "../controllers/bookController.js";

const bookRouter = Router();

bookRouter.get("/:bid", bookInfo);

bookRouter.delete("/:bid", isAuth, bookDelete);

bookRouter.get("/", bookInfoAll);

bookRouter.post("/", isAuth, bookCreate);

export default bookRouter;
