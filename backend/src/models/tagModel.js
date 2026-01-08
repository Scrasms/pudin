import pool from "../../config/db.js";

/**
 * Creates a new tag with the provided name
 * @param {string} tagName - name of new tag
 */
const createTag = async (tagName) => {
    await pool.query("INSERT INTO Tag (tag_name) VALUES ($1)", [tagName]);
};

export { createTag };
