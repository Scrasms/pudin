import pool from "../../config/db.js";

/**
 * Creates a comment
 * @param {string} message - message of comment
 * @param {uuid} bid - book's bid
 * @param {number} number - chapter number
 * @param {uuid} uid - user's uid
 * @param {uuid} repliesTo - cid of the comment this comment is replying to
 * @returns the cid of the newly created comment
 */
const createComment = async (message, bid, number, uid, repliesTo) => {
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

export { createComment };
