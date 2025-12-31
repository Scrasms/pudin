import pool from "../../config/db.js";

/**
 * Adds user to User table
 * @param {string} email - user's unique email
 * @param {string} password - user's (encrypted) password
 * @param {string} username - user's unique username
 */
const createUser = async (email, password, username) => {
    await pool.query(
        "INSERT INTO users (email, password, username) VALUES ($1, $2, $3)",
        [email, password, username]
    );
};

export default { createUser };
