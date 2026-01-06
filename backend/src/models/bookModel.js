import pool from "../../config/db.js";

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

export { createBook, updateBookCover };
