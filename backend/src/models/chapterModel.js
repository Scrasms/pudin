import pool from "../../config/db.js";

/**
 * Creates a new chapter
 * @param {uuid} bid - the book's bid
 * @param {string} [title] - the chapter's optional title
 * @returns true if chapter was created and false otherwise
 */
const createChapter = async (bid, title) => {
    // Get next chapter number
    const { rows } = await pool.query(
        "SELECT MAX(number) AS prev FROM Chapter WHERE bid = $1",
        [bid],
    );
    const number = rows[0].prev + 1;

    if (!title) {
        title = `Chapter ${number}`;
    }

    const { rowCount } = await pool.query(
        "INSERT INTO Chapter (bid, number, title) VALUES ($1, $2, $3)",
        [bid, number, title],
    );

    return rowCount > 0;
};

export { createChapter };
