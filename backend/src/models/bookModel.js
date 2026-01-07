import pool from "../../config/db.js";

/**
 * Finds and returns book with matching bid
 * @param {uuid} bid - book's bid
 * @returns the book if found or undefined otherwise
 */
const getBookById = async (bid) => {
    const { rows } = await pool.query("SELECT * FROM BookInfo WHERE bid = $1", [
        bid,
    ]);
    return rows[0];
};

/**
 * Finds and returns the tags associated with the book
 * @param {uuid} bid - book's bid
 * @returns the tags of the book in an array
 */
const getBookTags = async (bid) => {
    const { rows } = await pool.query(
        "SELECT * FROM BookTagsList WHERE bid = $1",
        [bid]
    );
    return rows[0].tags;
};

/**
 * Adds book to the Book table
 * @param {string} title - book's title
 * @param {string} blurb - book's blurb
 * @param {uuid} uid - the author's uid
 * @returns the bid of the newly created book
 */
const createBook = async (title, blurb, uid) => {
    const { rows } = await pool.query(
        "INSERT INTO Book (title, blurb, written_by) VALUES ($1, $2, $3) RETURNING bid",
        [title, blurb, uid]
    );

    return rows[0].bid;
};

/**
 * Updates the cover of a book
 * @param {uuid} bid - book's bid
 * @param {string} coverLink - link to the book's cover image
 */
const updateBookCover = async (bid, coverLink) => {
    await pool.query("UPDATE Book SET image = $1 WHERE bid = $2", [
        coverLink,
        bid,
    ]);
};

/**
 * Deletes a book belonging to the user
 * @param {uuid} bid - the book's bid
 * @param {uuid} uid - the user's uid
 */
const deleteBook = async (bid, uid) => {
    // WHERE clause is false if user doesn't own the book
    const { rowCount } = await pool.query(
        "DELETE FROM Book WHERE bid = $1 AND written_by = $2",
        [bid, uid]
    );

    return rowCount > 0;
};

export { getBookById, getBookTags, createBook, updateBookCover, deleteBook };
