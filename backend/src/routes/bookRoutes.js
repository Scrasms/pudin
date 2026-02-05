import { Router } from "express";
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

// Get information about all published books
bookRouter.get("/", bookInfoAll);

bookRouter.post("/", isAuth, bookCreate);

// Adds a new tag to a book owned by the user
bookRouter.post("/:bid/tag", isAuth, bookTag);

// Deletes a specific tag from a book owned by the user
bookRouter.delete("/:bid/tag", isAuth, bookUntag);

// Get information about a specific book
// Book must be published to be found, unless the user owns the book
bookRouter.get("/:bid", bookInfo);

// Updates a book's title, blurb, book cover and 'published' status
bookRouter.put("/:bid", isAuth, bookUpdate);

bookRouter.delete("/:bid", isAuth, bookDelete);

export default bookRouter;
