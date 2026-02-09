import pool from "../../config/db.js";

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
 * @param {uuid} bid - book's bid
 * @param {number} number - chapter number
 * @returns the top-level comments of that chapter
 */
const getCommentByChapter = async (bid, number) => {
    const queryStr = `
        SELECT *
        FROM Comment
        WHERE bid = $1 AND number = $2 AND replies_to IS NULL
        ORDER BY posted_at ASC
    `;
    const { rows } = await pool.query(queryStr, [bid, number]);
    return rows;
};

export { createComment, updateComment, deleteComment, getCommentByChapter };
