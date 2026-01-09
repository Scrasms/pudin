import Router from "express";
import isAuth from "../middleware/isAuth.js";
import {
    bookCreate,
    bookInfo,
    bookInfoAll,
    bookUpdate,
    bookDelete,
    bookTag,
    bookUntag,
} from "../controllers/bookController.js";

const bookRouter = Router();

bookRouter.get("/", bookInfoAll);

bookRouter.post("/", isAuth, bookCreate);

bookRouter.get("/:bid", bookInfo);

bookRouter.put("/:bid", isAuth, bookUpdate);

bookRouter.delete("/:bid", isAuth, bookDelete);

bookRouter.post("/:bid/tag", isAuth, bookTag);

bookRouter.delete("/:bid/tag", isAuth, bookUntag);

export default bookRouter;
