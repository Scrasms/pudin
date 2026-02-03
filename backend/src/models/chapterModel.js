import pool from "../../config/db.js";

/**
 * Creates a new chapter
 * @param {uuid} bid - the book's bid
 * @param {string} [title] - the chapter's optional title
 * @returns the POSITIVE chapter number if created and 0 otherwise
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

    return rowCount ? number : 0;
};

/**
 * Updates the text fields of a chapter (title and content)
 * @param {uuid} bid - the book's bid
 * @param {number} number - the chapter number
 * @param {string} [title] - the chapter's title
 * @param {string} [content] - the chapter's contents
 */
const updateChapterText = async (bid, number, title, content) => {
    // '' should be valid but is falsy so check for null instead
    if (title === null && content === null) {
        return;
    }

    let queryStr = "UPDATE Chapter SET";
    const params = [];
    let paramIdx = 1;

    if (title !== null) {
        queryStr += ` title = $${paramIdx++}`;
        params.push(title);
    }

    if (content !== null) {
        if (title !== null) {
            queryStr += ",";
        }
        queryStr += ` content = $${paramIdx++}`;
        params.push(content);
    }

    queryStr += ` WHERE bid = $${paramIdx++}`;
    params.push(bid);

    queryStr += ` AND number = $${paramIdx++}`;
    params.push(number);

    console.log(queryStr);

    await pool.query(queryStr, params);
};

/**
 * Updates the publish status of a chapter (whether it's visible to everyone or just the owner)
 * @param {uuid} bid - book's bid
 * @param {number} number - the chapter number
 * @param {boolean} [publish] - true if we want to publish the chapter and false if we want to unpublish it
 * @returns - true if chapter was published/unpublished and false otherwise
 */
const updateChapterPublish = async (bid, number, publish) => {
    // If we want to publish, the book has to be unpublished
    // If we want to unpublish, the book has to be published
    const publishVal = publish ? "NOW()" : null;
    const publishCond = publish
        ? "published_at IS NULL"
        : "published_at IS NOT NULL";

    const { rowCount } = await pool.query(
        `UPDATE Chapter SET published_at = $1 WHERE bid = $2 AND number = $3 AND ${publishCond}`,
        [publishVal, bid, number],
    );

    return rowCount > 0;
};

export { createChapter, updateChapterText, updateChapterPublish };
