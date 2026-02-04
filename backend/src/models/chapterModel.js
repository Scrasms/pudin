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

    if (!title) {
        title = `Chapter ${number}`;
    }
    queryStr += ` title = $${paramIdx++}`;
    params.push(title);

    if (content !== null) {
        queryStr += `, content = $${paramIdx++}`;
        params.push(content);
    }

    queryStr += ` WHERE bid = $${paramIdx++}`;
    params.push(bid);

    queryStr += ` AND number = $${paramIdx++}`;
    params.push(number);

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

/**
 * Finds information about a single chapter
 * @param {uuid} bid - book's bid
 * @param {number} [number] - chapter number, only returns that chapter if provided, otherwise returns all chapters in the book
 * @param {boolean} publishedOnly - restrict search to published chapters only or not
 * @returns info about the chapter
 */
const getChapterById = async (bid, number, publishedOnly) => {
    // Only show created_at when publishedOnly is false (when user owns the chapter)
    // If number is provided, display info about that one chapter rather than all chapters of the book
    let queryStr = `
        SELECT
            ${number ? "bid," : ""}
            number,
            title,
            ${number ? "content," : ""}
            ${publishedOnly ? "" : "created_at,"}
            published_at,
            likes,
            reads
        FROM Chapter
        WHERE bid = $1 ${number ? "AND number = $2" : ""}
    `;

    const params = [];
    params.push(bid);

    if (number) {
        params.push(number);
    }

    if (publishedOnly) {
        queryStr += " AND published_at IS NOT NULL";
    }
    queryStr += " ORDER BY number";

    const { rows } = await pool.query(queryStr, params);
    return rows;
};

/**
 * Increments the number of reads of the chapter by one
 * @param {uuid} bid - book's bid
 * @param {number} number - chapter number
 */
const updateChapterNumReads = async (bid, number) => {
    await pool.query(
        "UPDATE Chapter SET reads = reads + 1 WHERE bid = $1 AND number = $2",
        [bid, number],
    );
};

/**
 * Creates a new entry in ChapterReads tracking the last-read chapter of each book for each user
 * @param {uuid} bid - book's bid
 * @param {number} number - chapter number
 * @param {uuid} uid - user's uid
 */
const createChapterReads = async (bid, number, uid) => {
    // Only keep one entry for each chapter that the user has read
    const queryStr = `
        INSERT INTO
        ChapterReads (uid, bid, number)
        VALUES ($1, $2, $3)
        ON CONFLICT (uid, bid, number)
        DO UPDATE SET
            read_at = now()
    `;

    await pool.query(queryStr, [uid, bid, number]);
};

/**
 * Finds the user's last read chapter for the given book that is published
 * @param {uuid} bid - book's bid
 * @param {uuid} uid - user's uid
 * @returns the last read chapter for the given book
 */
const getLastReadChapter = async (bid, uid) => {
    const queryStr = `
        SELECT *
        FROM ChapterReadsPublished
        WHERE uid = $1 AND bid = $2
        ORDER BY read_at DESC
        LIMIT 1
    `;

    const { rows } = await pool.query(queryStr, [uid, bid]);

    return rows;
};

/**
 * Deletes the given chapter
 * @param {uuid} bid - the book's bid
 * @param {number} number - chapter number
 * @returns true if successfully deleted and false otherwise
 */
const deleteChapter = async (bid, number) => {
    const { rowCount } = await pool.query(
        "DELETE FROM Chapter WHERE bid = $1 AND number = $2",
        [bid, number],
    );
    return rowCount > 0;
};

/**
 * Deletes all entries from ChapterReads for the given user and book pair
 * @param {uuid} bid - book's bid
 * @param {uuid} uid - user's uid
 */
const deleteChapterReads = async (bid, uid) => {
    await pool.query("DELETE FROM ChapterReads WHERE uid = $1 AND bid = $2", [
        uid,
        bid,
    ]);
};

export {
    createChapter,
    updateChapterText,
    updateChapterPublish,
    getChapterById,
    updateChapterNumReads,
    createChapterReads,
    getLastReadChapter,
    deleteChapter,
    deleteChapterReads,
};
