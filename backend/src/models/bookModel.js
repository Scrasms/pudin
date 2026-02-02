import pool from "../../config/db.js";

/**
 * Check if a user owns the book
 * @param {uuid} bid - book's bid
 * @param {uuid} uid - user's uid
 * @returns - true if the user owns the book and false otherwise
 */
const userOwnsBook = async (bid, uid) => {
    const { rowCount } = await pool.query(
        "SELECT 1 FROM Book WHERE bid = $1 AND written_by = $2",
        [bid, uid],
    );

    return rowCount > 0;
};

/**
 * Finds and returns all books written by the given uid
 * @param {uuid} uid - user's uid
 * @param {boolean} publishedOnly - restrict search to published books only or not
 * @returns books written by the user
 */
const getBooksByUser = async (uid, publishedOnly) => {
    const table = publishedOnly ? "BookInfoPublished" : "BookInfoAll";
    let queryStr = `SELECT * FROM ${table} WHERE written_by = $1`;

    const { rows } = await pool.query(queryStr, [uid]);

    return rows;
};

/**
 * Finds and returns the book with matching bid
 * @param {uuid} bid - book's bid
 * @param {boolean} publishedOnly - restrict search to published books only or not
 * @returns the book if found or undefined otherwise
 */
const getBookById = async (bid, publishedOnly) => {
    const table = publishedOnly ? "BookInfoPublished" : "BookInfoAll";
    let queryStr = `SELECT * FROM ${table} WHERE bid = $1`;

    const { rows } = await pool.query(queryStr, [bid]);
    return rows[0];
};

/**
 * Finds and returns basic information about the chapters of a book
 * @param {uuid} bid - book's bid
 * @param {boolean} publishedOnly - restrict search to published chapters only or not
 * @returns array of chapter objects
 */
const getBookChapters = async (bid, publishedOnly) => {
    // Only show created_at when publishedOnly is false (when user owns the chapter)
    let queryStr = `
        SELECT
            number,
            title,
            ${publishedOnly ? "" : "created_at,"}
            published_at,
            likes,
            reads
        FROM Chapter
        WHERE bid = $1
    `;

    if (publishedOnly) {
        queryStr += " AND published_at IS NOT NULL";
    }
    queryStr += " ORDER BY number";

    const { rows } = await pool.query(queryStr, [bid]);
    return rows;
};

/**
 * Finds and returns the tags associated with a book
 * @param {uuid} bid - book's bid
 * @returns the tags of the book in an array
 */
const getBookTags = async (bid) => {
    const { rows } = await pool.query(
        "SELECT tags FROM BookTagsList WHERE bid = $1",
        [bid],
    );
    return rows[0].tags;
};

/**
 * Gets all published books from the database, applying pagination, sorting and filters
 * @param {string} [order] - sorting order, format: +/-FIELD, + means ASC, - means DESC
 * @param {number} [limit] - how many books to display in one page
 * @param {number} [offset] - the offset from the beginning of the books (a.k.a the page)
 * @param {string} [tag] - the tag to filter by
 * @param {string} [searchQuery] - only display books with titles that start with the searchQuery
 * @returns books in the desired page, order and filter
 */
const getAllPublishedBooks = async (order, limit, offset, tag, searchQuery) => {
    // Protect against SQL injection
    const allowedOrders = new Set([
        "title",
        "published_at",
        "total_likes",
        "total_reads",
    ]);

    // Set default values when orderDir or orderBy are unprovided or invalid
    let orderDir = order && order[0] === "-" ? "DESC" : "ASC";
    let orderBy = order ? order.slice(1, order.length) : "title";
    orderBy = allowedOrders.has(orderBy) ? orderBy : "title";

    let queryStr = "SELECT * FROM BookInfoPublished bi";
    const params = [];
    let paramIdx = 1;

    if (tag) {
        queryStr += `
            JOIN BookTagsList btl ON bi.bid = btl.bid
            WHERE $${paramIdx++} = ANY(btl.tags)
        `;
        params.push(tag);
    }

    if (searchQuery) {
        if (tag) {
            queryStr += ` AND`;
        } else {
            queryStr += ` WHERE`;
        }
        searchQuery += "%";
        queryStr += ` bi.title ILIKE $${paramIdx++}`;
        params.push(searchQuery);
    }

    queryStr += ` ORDER BY ${orderBy} ${orderDir}`;

    if (limit || limit === 0) {
        queryStr += ` LIMIT $${paramIdx++}`;
        params.push(limit);
    }

    // Don't set if offset === 0 since it's 0 by default
    if (offset) {
        queryStr += ` OFFSET $${paramIdx++}`;
        params.push(offset);
    }

    const { rows } = await pool.query(queryStr, params);

    return rows;
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
        [title, blurb, uid],
    );

    return rows[0].bid;
};

/**
 * Updates the text fields (title and blurb) of a book
 * @param {uuid} bid - book's bid
 * @param {string} [newTitle] - new title
 * @param {string} [newBlurb] - new blurb
 */
const updateBookText = async (bid, newTitle, newBlurb) => {
    if (!newTitle && !newBlurb) {
        return;
    }

    let queryStr = "UPDATE Book SET";
    const params = [];
    let paramIdx = 1;

    if (newTitle) {
        queryStr += ` title = $${paramIdx++}`;
        params.push(newTitle);
    }

    if (newBlurb) {
        queryStr += ` blurb = $${paramIdx++}`;
        params.push(newBlurb);
    }

    queryStr += ` WHERE bid = $${paramIdx++}`;
    params.push(bid);

    await pool.query(queryStr, params);
};

/**
 * Updates the cover of a book, assumes the user owns the book
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
 * Updates the publish status of a book (whether it's visible to everyone or just the owner)
 * @param {uuid} bid - book's bid
 * @param {boolean} publish - true if we want to publish the book and false if we want to unpublish it
 * @returns - true if book was published/unpublished and false otherwise
 */
const updateBookPublish = async (bid, publish) => {
    // If we want to publish, the book has to be unpublished
    // If we want to unpublish, the book has to be published
    const publishVal = publish ? "NOW()" : null;
    const publishCond = publish
        ? "published_at IS NULL"
        : "published_at IS NOT NULL";

    const { rowCount } = await pool.query(
        `UPDATE Book SET published_at = $1 WHERE bid = $2 AND ${publishCond}`,
        [publishVal, bid],
    );

    return rowCount > 0;
};

/**
 * Deletes a book belonging to the user
 * @param {uuid} bid - the book's bid
 * @param {uuid} uid - the user's uid
 * @returns true if book was deleted and false otherwise
 */
const deleteBook = async (bid, uid) => {
    const { rowCount } = await pool.query(
        "DELETE FROM Book WHERE bid = $1 AND written_by = $2",
        [bid, uid],
    );

    return rowCount > 0;
};

export {
    userOwnsBook,
    getBooksByUser,
    getBookById,
    getBookChapters,
    getBookTags,
    getAllPublishedBooks,
    createBook,
    updateBookText,
    updateBookCover,
    updateBookPublish,
    deleteBook,
};
