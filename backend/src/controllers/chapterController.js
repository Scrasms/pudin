import DBError from "../errors/DBError.js";
import InputError from "../errors/InputError.js";
import { userOwnsBook } from "../models/bookModel.js";
import {
    createChapter,
    updateChapterPublish,
    updateChapterText,
} from "../models/chapterModel.js";

const chapterCreate = async (req, res) => {
    const bid = req.params.bid.trim();
    const { title } = req.body;

    try {
        const chapterNum = await createChapter(bid, title);
        if (!chapterNum) {
            throw new InputError("Chapter was not created, please try again");
        }

        const chapterData = {
            bid: bid,
            number: chapterNum,
        };

        res.status(201).json({
            success: true,
            data: {
                chapter: chapterData,
            },
        });
    } catch (err) {
        if (err instanceof InputError) throw err;
        throw new DBError(err);
    }
};

const chapterUpdate = async (req, res) => {
    const bid = req.params.bid.trim();
    const number = req.params.number.trim();
    const { title, content, publish } = req.body;
    const uid = req.user.uid;

    try {
        let success = await userOwnsBook(bid, uid);
        if (!success) {
            throw new InputError("Book not found or user didn't write it");
        }
        await updateChapterText(bid, number, title, content);

        success = await updateChapterPublish(bid, number, publish);
        if (!success && publish) {
            throw new InputError("Chapter is already published");
        } else if (!success) {
            throw new InputError("Chapter is already unpublished");
        }

        res.json({ success: true });
    } catch (err) {
        if (err instanceof InputError) throw err;
        throw new DBError(err);
    }
};

export { chapterCreate, chapterUpdate };
