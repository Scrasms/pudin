import DBError from "../errors/DBError.js";
import InputError from "../errors/InputError.js";
import { createChapter } from "../models/chapterModel.js";

const chapterCreate = async (req, res) => {
    const bid = req.params.bid.trim();
    const { title } = req.body;

    try {
        const success = await createChapter(bid, title);
        if (!success) {
            throw new InputError("Chapter was not created, please try again");
        }

        res.status(201).json({ success: true });
    } catch (err) {
        if (err instanceof InputError) throw err;
        throw new DBError(err);
    }
};

export { chapterCreate };
