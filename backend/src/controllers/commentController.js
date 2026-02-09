import DBError from "../errors/DBError.js";
import InputError from "../errors/InputError.js";
import { checkChapterExists } from "../models/chapterModel.js";
import {
    createComment,
    deleteComment,
    getCommentByChapter,
    updateComment,
} from "../models/commentModel.js";

const commentCreate = async (req, res) => {
    const bid = req.params.bid.trim();
    const number = req.params.number.trim();
    const { message, repliesTo } = req.body;
    const uid = req.user.uid;

    try {
        // Can only comment on published chapter
        const success = await checkChapterExists(bid, number, true);
        if (!success) {
            throw new InputError("Chapter not found");
        }

        const cid = await createComment(bid, number, uid, message, repliesTo);

        const commentData = {
            cid: cid,
        };

        res.status(201).json({
            success: true,
            data: {
                comment: commentData,
            },
        });
    } catch (err) {
        if (err instanceof InputError) throw err;
        throw new DBError(err);
    }
};

const commentUpdate = async (req, res) => {
    const bid = req.params.bid.trim();
    const number = req.params.number.trim();
    const cid = req.params.cid.trim();
    const { message } = req.body;
    const uid = req.user.uid;

    try {
        // Can only update comment on published chapter
        let success = await checkChapterExists(bid, number, true);
        if (!success) {
            throw new InputError("Chapter not found");
        }

        success = await updateComment(cid, uid, message);
        if (!success) {
            throw new InputError("Comment not found or user did not write it");
        }

        res.json({ success: true });
    } catch (err) {
        if (err instanceof InputError) throw err;
        throw new DBError(err);
    }
};

const commentDelete = async (req, res) => {
    const bid = req.params.bid.trim();
    const number = req.params.number.trim();
    const cid = req.params.cid.trim();
    const uid = req.user.uid;

    try {
        // Can only delete comment on published chapter
        let success = await checkChapterExists(bid, number, true);
        if (!success) {
            throw new InputError("Chapter not found");
        }

        success = await deleteComment(cid, uid);
        if (!success) {
            throw new InputError("Comment not found or user did not write it");
        }

        res.json({ success: true });
    } catch (err) {
        if (err instanceof InputError) throw err;
        throw new DBError(err);
    }
};

const commentInfo = async (req, res) => {
    const bid = req.params.bid.trim();
    const number = req.params.number.trim();

    try {
        // Can only get comments on published chapter
        const success = await checkChapterExists(bid, number, true);
        if (!success) {
            throw new InputError("Chapter not found");
        }

        const allCommentsData = await getCommentByChapter(bid, number);

        res.json({
            success: true,
            data: allCommentsData,
        });
    } catch (err) {
        if (err instanceof InputError) throw err;
        throw new DBError(err);
    }
};

export { commentCreate, commentUpdate, commentDelete, commentInfo };
