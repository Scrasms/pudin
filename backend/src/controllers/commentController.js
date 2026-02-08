import DBError from "../errors/DBError.js";
import InputError from "../errors/InputError.js";
import { checkChapterExists } from "../models/chapterModel.js";
import { createComment } from "../models/commentModel.js";

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

        const cid = await createComment(message, bid, number, uid, repliesTo);

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

export { commentCreate };
