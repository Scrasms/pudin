import pool from "../../config/db.js";

/**
 * Creates a new tag with the provided name
 * @param {string} tagName - name of new tag
 */
const createTag = async (tagName) => {
    await pool.query("INSERT INTO Tag (tag_name) VALUES ($1)", [tagName]);
};

/**
 * Tags a book
 * @param {uuid} bid - the book
 * @param {string} tagName - the tag
 */
const tagBook = async (bid, tagName) => {
    await pool.query("INSERT INTO BookTags (bid, tag_name) VALUES ($1, $2)", [
        bid,
        tagName,
    ]);
};

/**
 * Remove a tag from a book
 * @param {uuid} bid - the book
 * @param {string} tagName - the tag
 * @returns true if tag was removed and false otherwise (when tag does not exist)
 */
const untagBook = async (bid, tagName) => {
    const { rowCount } = await pool.query(
        "DELETE FROM BookTags WHERE bid = $1 AND tag_name = $2",
        [bid, tagName],
    );
    return rowCount > 0;
};

export { createTag, tagBook, untagBook };
