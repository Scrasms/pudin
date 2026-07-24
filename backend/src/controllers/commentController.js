import DBError from "../errors/DBError.js";
import InputError from "../errors/InputError.js";
import { checkChapterExists } from "../models/chapterModel.js";
import {
    checkCommentExists,
    createComment,
    createCommentLikes,
    deleteComment,
    deleteCommentLikes,
    getCommentByChapter,
    getCommentReplies,
    updateComment,
} from "../models/commentModel.js";
import { checkPublishedOnly } from "../utils/publish.js";

/**
 * Checks that a comment's chapter exists
 * @param {Object} user - user object
 * @param {uuid} bid - book's bid
 * @param {number} number - chapter number
 * @returns true if it exists and false otherwise
 */
const validateCommentChapter = async (user, bid, number) => {
    // Can only operate on published chapter unless user is the owner
    const publishedOnly = await checkPublishedOnly(user, bid);
    return await checkChapterExists(bid, number, publishedOnly);
};

const commentCreate = async (req, res) => {
    const bid = req.params.bid.trim();
    const number = req.params.number.trim();
    const { message, repliesTo } = req.body;
    const uid = req.user.uid;

    try {
        const success = await validateCommentChapter(req.user, bid, number);
        if (!success) {
            throw new InputError("Chapter not found");
        }

        const cid = await createComment(bid, number, uid, message, repliesTo);

        res.status(201).json({
            cid: cid,
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
        let success = await validateCommentChapter(req.user, bid, number);
        if (!success) {
            throw new InputError("Chapter not found");
        }

        success = await updateComment(cid, uid, message);
        if (!success) {
            throw new InputError("Comment not found or user did not write it");
        }

        res.json({ message: "Comment successfully updated" });
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
        let success = await validateCommentChapter(req.user, bid, number);
        if (!success) {
            throw new InputError("Chapter not found");
        }

        success = await deleteComment(cid, uid);
        if (!success) {
            throw new InputError("Comment not found or user did not write it");
        }

        res.json({ message: "Comment successfully deleted" });
    } catch (err) {
        if (err instanceof InputError) throw err;
        throw new DBError(err);
    }
};

const commentInfo = async (req, res) => {
    const bid = req.params.bid.trim();
    const number = req.params.number.trim();

    try {
        const success = await validateCommentChapter(req.user, bid, number);
        if (!success) {
            throw new InputError("Chapter not found");
        }

        const allCommentsData = await getCommentByChapter(
            req.user.uid,
            bid,
            number,
        );

        res.json(allCommentsData);
    } catch (err) {
        if (err instanceof InputError) throw err;
        throw new DBError(err);
    }
};

const commentReplyInfo = async (req, res) => {
    const bid = req.params.bid.trim();
    const number = req.params.number.trim();
    const cid = req.params.cid.trim();

    try {
        const success = await validateCommentChapter(req.user, bid, number);
        if (!success) {
            throw new InputError("Chapter not found");
        }

        const allRepliesData = await getCommentReplies(
            req.user.uid,
            cid,
            bid,
            number,
        );

        res.json(allRepliesData);
    } catch (err) {
        if (err instanceof InputError) throw err;
        throw new DBError(err);
    }
};

const commentLike = async (req, res) => {
    const bid = req.params.bid.trim();
    const number = req.params.number.trim();
    const cid = req.params.cid.trim();
    const uid = req.user.uid;

    try {
        let success = await validateCommentChapter(req.user, bid, number);
        if (!success) {
            throw new InputError("Chapter not found");
        }

        success = await checkCommentExists(cid, bid, number);
        if (!success) {
            throw new InputError("Comment not found");
        }

        await createCommentLikes(cid, uid);

        res.status(201).json({ message: "Comment successfully liked" });
    } catch (err) {
        if (err instanceof InputError) throw err;
        throw new DBError(err);
    }
};

const commentUnlike = async (req, res) => {
    const bid = req.params.bid.trim();
    const number = req.params.number.trim();
    const cid = req.params.cid.trim();
    const uid = req.user.uid;

    try {
        let success = await validateCommentChapter(req.user, bid, number);
        if (!success) {
            throw new InputError("Chapter not found");
        }

        success = await checkCommentExists(cid, bid, number);
        if (!success) {
            throw new InputError("Comment not found");
        }

        success = await deleteCommentLikes(cid, uid);
        if (!success) {
            throw new InputError("User has already unliked the comment");
        }

        res.json({ message: "Comment successfully unliked" });
    } catch (err) {
        if (err instanceof InputError) throw err;
        throw new DBError(err);
    }
};

export {
    commentCreate,
    commentUpdate,
    commentDelete,
    commentInfo,
    commentReplyInfo,
    commentLike,
    commentUnlike,
};
