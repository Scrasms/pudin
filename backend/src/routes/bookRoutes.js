import Router from "express";
import isAuth from "../middleware/isAuth.js";
import {
    bookCreate,
    bookInfo,
    bookInfoAll,
    bookDelete,
    bookTag
} from "../controllers/bookController.js";

const bookRouter = Router();

bookRouter.get("/", bookInfoAll);

bookRouter.post("/", isAuth, bookCreate);

bookRouter.get("/:bid", bookInfo);

bookRouter.delete("/:bid", isAuth, bookDelete);

bookRouter.post("/:bid/tag", isAuth, bookTag);

export default bookRouter;
