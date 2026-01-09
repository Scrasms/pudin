import pool from "../../config/db.js";
import InputError from "../errors/InputError.js";

/**
 * Check if a user owns the book
 * @param {uuid} bid - book's bid
 * @param {uuid} uid - user's uid
 * @returns - true if the user owns the book and false otherwise
 */
const userOwnsBook = async (bid, uid) => {
    const { rowCount } = await pool.query(
        "SELECT 1 FROM Book WHERE bid = $1 AND written_by = $2",
        [bid, uid]
    );

    return rowCount > 0;
};

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
 * Finds and returns basic information about the chapters of a book
 * @param {uuid} bid - book's bid
 * @returns array of chapter objects
 */
const getBookChapters = async (bid) => {
    const queryStr = `
        SELECT
            number,
            title,
            created_at,
            published_at,
            likes,
            reads
        FROM Chapter
        WHERE bid = $1
        ORDER BY number
    `;

    const { rows } = await pool.query(queryStr, [bid]);
    return rows;
};

/**
 * Finds and returns the tags associated with the book
 * @param {uuid} bid - book's bid
 * @returns the tags of the book in an array
 */
const getBookTags = async (bid) => {
    const { rows } = await pool.query(
        "SELECT tags FROM BookTagsList WHERE bid = $1",
        [bid]
    );
    return rows[0].tags;
};

/**
 * Gets all books from the database, applying pagination, sorting and filters
 * @param {string} order - sorting order, format: +/-FIELD, + means ASC, - means DESC
 * @param {number} limit - how many books to display in one page
 * @param {number} offset - the offset from the beginning of the books (a.k.a the page)
 * @param {string} tag - the tag to filter by
 * @returns books in the desired order and page
 */
const getAllBooks = async (order, limit, offset, tag) => {
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

    let queryStr = `
        SELECT *
        FROM BookInfo bi
    `;
    let params = [];
    let paramIdx = 1;

    if (tag) {
        queryStr += `
            JOIN BookTagsList btl ON bi.bid = btl.bid
            WHERE $${paramIdx++} = ANY(btl.tags)
        `;
        params.push(tag);
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
        [title, blurb, uid]
    );

    return rows[0].bid;
};

/**
 * Updates the text fields (title and blurb) of a book
 * @param {uuid} bid - book's bid
 * @param {string} newTitle - new title
 * @param {string} newBlurb - new blurb
 */
const updateBookText = async (bid, newTitle, newBlurb) => {
    await pool.query("UPDATE Book SET title = $1, blurb = $2 WHERE bid = $3", [
        newTitle,
        newBlurb,
        bid,
    ]);
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
 * Deletes a book belonging to the user
 * @param {uuid} bid - the book's bid
 * @param {uuid} uid - the user's uid
 * @returns true if book was deleted and false otherwise
 */
const deleteBook = async (bid, uid) => {
    const { rowCount } = await pool.query(
        "DELETE FROM Book WHERE bid = $1 AND written_by = $2",
        [bid, uid]
    );

    return rowCount > 0;
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
const unTagBook = async (bid, tagName) => {
    const { rowCount } = await pool.query(
        "DELETE FROM BookTags WHERE bid = $1 AND tag_name = $2",
        [bid, tagName]
    );
    return rowCount > 0;
};

export {
    userOwnsBook,
    getBookById,
    getBookChapters,
    getBookTags,
    getAllBooks,
    createBook,
    updateBookText,
    updateBookCover,
    deleteBook,
    tagBook,
    unTagBook,
};
