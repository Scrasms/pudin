import pool from "../../config/db.js";

/**
 * Check if a comment exists in the chapter
 * @param {uuid} cid - comment's cid
 * @param {uuid} bid - book's bid
 * @param {number} number - chapter number
 * @returns true if the comment exists in the chapter and false otherwise
 */
const checkCommentExists = async (cid, bid, number) => {
    const { rowCount } = await pool.query(
        "SELECT 1 FROM Comment WHERE cid = $1 AND bid = $2 AND number = $3",
        [cid, bid, number],
    );

    return rowCount > 0;
};

/**
 * Creates a comment
 * @param {uuid} bid - book's bid
 * @param {number} number - chapter number
 * @param {uuid} uid - user's uid
 * @param {string} message - message of comment
 * @param {uuid} repliesTo - cid of the comment this comment is replying to
 * @returns the cid of the newly created comment
 */
const createComment = async (bid, number, uid, message, repliesTo) => {
    const queryStr = `
        INSERT INTO Comment
        (message, bid, number, posted_by${repliesTo ? ", replies_to" : ""})
        VALUES ($1, $2, $3, $4${repliesTo ? ", $5" : ""})
        RETURNING cid
    `;
    const params = [message, bid, number, uid];
    if (repliesTo) {
        params.push(repliesTo);
    }
    const { rows } = await pool.query(queryStr, params);
    return rows[0].cid;
};

/**
 * Updates a user's comment
 * @param {uuid} cid - comment's cid
 * @param {uuid} uid - the user's uid
 * @param {string} message - new message of comment
 * @returns true if the comment was updated and false otherwise
 */
const updateComment = async (cid, uid, message) => {
    const { rowCount } = await pool.query(
        "UPDATE Comment SET message = $1 WHERE cid = $2 AND posted_by = $3",
        [message, cid, uid],
    );
    return rowCount > 0;
};

/**
 * Deletes a user's comment
 * @param {uuid} cid - comment's cid
 * @param {uuid} uid - user's uid
 * @returns true if comment was deleted and false otherwise
 */
const deleteComment = async (cid, uid) => {
    const { rowCount } = await pool.query(
        "DELETE FROM Comment WHERE cid = $1 AND posted_by = $2",
        [cid, uid],
    );
    return rowCount > 0;
};

/**
 * Gets all top-level comments of a chapter
 * @param {uuid} uid - user's uid
 * @param {uuid} bid - book's bid
 * @param {number} number - chapter number
 * @returns the top-level comments of that chapter
 */
const getCommentByChapter = async (uid, bid, number) => {
    const queryStr = `
        SELECT 
            c.*,
            EXISTS ( 
                SELECT 1 FROM CommentLikes l 
                WHERE l.uid = $1 AND l.cid = c.cid
            ) as liked
        FROM Comment c
        WHERE c.bid = $2 AND c.number = $3 AND c.replies_to IS NULL
        ORDER BY c.posted_at ASC
    `;
    const { rows } = await pool.query(queryStr, [uid, bid, number]);
    return rows;
};

/**
 * Gets all the replies to a comment of a chapter
 * @param {uuid} uid - user's uid
 * @param {uuid} cid - comment's cid
 * @param {uuid} bid - book's bid
 * @param {uuid} number - chapter number
 * @returns comment's replies
 */
const getCommentReplies = async (uid, cid, bid, number) => {
    const queryStr = `
        SELECT 
            c.*,
            EXISTS ( 
                SELECT 1 FROM CommentLikes l 
                WHERE l.uid = $1 AND l.cid = c.cid
            ) as liked
        FROM Comment c
        WHERE c.bid = $1 AND c.number = $2 AND c.replies_to = $3
        ORDER BY c.posted_at ASC
    `;

    const { rows } = await pool.query(queryStr, [bid, number, cid]);
    return rows;
};

/**
 * Likes a comment by adding an entry in the CommentLikes table
 * @param {uuid} cid - comment's cid
 * @param {uuid} uid - user's uid
 */
const createCommentLikes = async (cid, uid) => {
    await pool.query("INSERT INTO CommentLikes (cid, uid) VALUES ($1, $2)", [
        cid,
        uid,
    ]);
};

/**
 * Unlikes a comment by removing its entry from the CommentLikes table
 * @param {uuid} cid - comment's cid
 * @param {uuid} uid - user's uid
 * @returns true if the comment was deleted and false otherwise
 */
const deleteCommentLikes = async (cid, uid) => {
    const { rowCount } = await pool.query(
        "DELETE FROM CommentLikes WHERE cid = $1 AND uid = $2",
        [cid, uid],
    );
    return rowCount > 0;
};

export {
    checkCommentExists,
    createComment,
    updateComment,
    deleteComment,
    getCommentByChapter,
    getCommentReplies,
    createCommentLikes,
    deleteCommentLikes,
};
