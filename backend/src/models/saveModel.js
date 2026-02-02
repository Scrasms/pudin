import pool from "../../config/db.js";

/**
 * Saves a book for the user
 * @param {uuid} uid - the user's uid
 * @param {uuid} bid - the book's bid
 */
const createUserBookSave = async (uid, bid) => {
    await pool.query("INSERT INTO BookSaves (uid, bid) VALUES ($1, $2)", [
        uid,
        bid,
    ]);
};

/**
 * Gets info about a user's saved book
 * @param {uuid} uid - the user's uid
 * @param {uuid} bid - the book's bid
 * @returns info about the user's saved book
 */
const getUserBookSave = async (uid, bid) => {
    const { rows } = await pool.query(
        "SELECT * FROM BookSaves WHERE uid = $1 AND bid = $2",
        [uid, bid],
    );

    return rows;
};

/**
 * Gets info about all of a user's saved books
 * @param {uuid} uid - the user's uid
 * @returns info about all of the user's saved books
 */
const getAllUserBookSaves = async (uid) => {
    const { rows } = await pool.query(
        "SELECT * FROM BookSaves WHERE uid = $1",
        [uid],
    );

    return rows;
};

/**
 * Updates the status of a user's saved book
 * @param {uuid} uid - the user's uid
 * @param {uuid} bid - the book's bid
 * @param {string} newStatus - the new status
 * @returns true if book was updated and false otherwise
 */
const updateUserBookSave = async (uid, bid, newStatus) => {
    const allowedStatuses = ["unread", "reading", "read"];
    if (!allowedStatuses.includes(newStatus)) return false;

    const { rowCount } = await pool.query(
        "UPDATE BookSaves SET status = $1 WHERE uid = $2 AND bid = $3",
        [newStatus, uid, bid],
    );

    return rowCount > 0;
};

/**
 * Unsaves a book
 * @param {uuid} uid - the user's uid
 * @param {uuid} bid - the book's bid
 * @returns true if book was successfully unsaved and false otherwise
 */
const deleteUserBookSave = async (uid, bid) => {
    const { rowCount } = await pool.query(
        "DELETE FROM BookSaves WHERE uid = $1 AND bid = $2",
        [uid, bid],
    );

    return rowCount > 0;
};

export {
    createUserBookSave,
    getUserBookSave,
    getAllUserBookSaves,
    updateUserBookSave,
    deleteUserBookSave,
};
