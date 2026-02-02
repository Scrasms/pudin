import { Router } from "express";
import isAuth from "../middleware/isAuth.js";
import {
    userBookSave,
    userBookSaveDelete,
    userBookSaveInfo,
    userBookSaveInfoAll,
    userBookSaveUpdate,
} from "../controllers/saveController.js";

const saveRouter = Router();

// Saves a book for the user with default status "unread"
saveRouter.post("/:bid", isAuth, userBookSave);

// Get save information about a user's specified saved book
saveRouter.get("/:bid", isAuth, userBookSaveInfo);

// Updates the status of the user's saved book
saveRouter.put("/:bid", isAuth, userBookSaveUpdate);

// Unsaves a book for the user
saveRouter.delete("/:bid", isAuth, userBookSaveDelete);

// Get general book information about all of a user's saved books
saveRouter.get("/", isAuth, userBookSaveInfoAll);

export default saveRouter;
