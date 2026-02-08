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

export { createComment, updateComment };
