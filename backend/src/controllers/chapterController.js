import DBError from "../errors/DBError.js";
import InputError from "../errors/InputError.js";
import { userOwnsBook } from "../models/bookModel.js";
import {
    createChapter,
    createChapterLikes,
    createChapterReads,
    deleteChapter,
    deleteChapterLikes,
    deleteChapterReads,
    getChapterById,
    getLastReadChapter,
    addChapterNumReads,
    updateChapterPublish,
    updateChapterText,
    addChapterNumLikes,
    subChapterNumLikes,
    checkChapterExists,
} from "../models/chapterModel.js";
import { checkPublishedOnly } from "../utils/publish.js";

const chapterCreate = async (req, res) => {
    const bid = req.params.bid.trim();
    const { title } = req.body;
    const uid = req.user.uid;

    try {
        const success = await userOwnsBook(bid, uid);
        if (!success) {
            throw new InputError("Book not found or user didn't write it");
        }

        const chapterNum = await createChapter(bid, title);
        if (!chapterNum) {
            throw new InputError("Book not found");
        }

        res.status(201).json({
            bid: bid,
            number: chapterNum,
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

        // User must be owner to update, so publishedOnly is always false
        success = await checkChapterExists(bid, number, false);
        if (!success) {
            throw new InputError("Chapter not found");
        }

        await updateChapterText(bid, number, title, content);

        success = await updateChapterPublish(bid, number, publish);
        if (!success && publish) {
            throw new InputError("Chapter is already published");
        } else if (!success) {
            throw new InputError("Chapter is already unpublished");
        }

        res.json({ message: "Chapter successfully updated" });
    } catch (err) {
        if (err instanceof InputError) throw err;
        throw new DBError(err);
    }
};

const chapterInfo = async (req, res) => {
    const bid = req.params.bid.trim();
    const number = req.params.number.trim();

    try {
        const publishedOnly = checkPublishedOnly(req.user, bid);
        const chapterData = await getChapterById(bid, number, publishedOnly);
        if (!chapterData.length) {
            throw new InputError("Chapter not found");
        }

        // Update read number if its not the owner reading the book
        if (publishedOnly) {
            await addChapterNumReads(bid, number);
        }

        // Track last-read chapter regardless of ownership
        if (req.user) {
            await createChapterReads(bid, number, req.user.uid);
        }

        res.json(chapterData);
    } catch (err) {
        if (err instanceof InputError) throw err;
        throw new DBError(err);
    }
};

const chapterLastRead = async (req, res) => {
    const bid = req.params.bid.trim();
    const uid = req.user.uid;

    const chapterData = await getLastReadChapter(bid, uid);

    res.json(chapterData);
};

const chapterDelete = async (req, res) => {
    const bid = req.params.bid.trim();
    const number = req.params.number.trim();
    const uid = req.user.uid;

    try {
        let success = await userOwnsBook(bid, uid);
        if (!success) {
            throw new InputError("Book not found or user didn't write it");
        }

        success = await deleteChapter(bid, number);
        if (!success) {
            throw new InputError("Chapter not found");
        }

        await deleteChapterReads(bid, number, uid);

        res.json({ message: "Chapter successfully deleted" });
    } catch (err) {
        if (err instanceof InputError) throw err;
        throw new DBError(err);
    }
};

const chapterLike = async (req, res) => {
    const bid = req.params.bid.trim();
    const number = req.params.number.trim();
    const uid = req.user.uid;

    try {
        // Nobody can like an unpublished chapter
        let success = await checkChapterExists(bid, number, true);
        if (!success) {
            throw new InputError("Chapter not found");
        }

        await createChapterLikes(bid, number, uid);
        await addChapterNumLikes(bid, number);
        res.status(201).json({ message: "Chapter successfully liked" });
    } catch (err) {
        throw new DBError(err);
    }
};

const chapterUnlike = async (req, res) => {
    const bid = req.params.bid.trim();
    const number = req.params.number.trim();
    const uid = req.user.uid;

    try {
        // Nobody can unlike an unpublished chapter
        let success = await checkChapterExists(bid, number, true);
        if (!success) {
            throw new InputError("Chapter not found");
        }

        success = await deleteChapterLikes(bid, number, uid);
        if (!success) {
            throw new InputError("User has already unliked the chapter");
        }
        await subChapterNumLikes(bid, number);
        res.json({ message: "Chapter successfully unliked" });
    } catch (err) {
        if (err instanceof InputError) throw err;
        throw new DBError(err);
    }
};
export {
    chapterCreate,
    chapterUpdate,
    chapterInfo,
    chapterLastRead,
    chapterDelete,
    chapterLike,
    chapterUnlike,
};
