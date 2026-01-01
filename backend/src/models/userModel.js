import pool from "../../config/db.js";

/**
 * Adds user to User table
 * @param {string} email - user's unique email
 * @param {string} password - user's (encrypted) password
 * @param {string} username - user's unique username
 * @returns the newly created user
 */
const createUser = async (email, password, username) => {
    const { rows } = await pool.query(
        "INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING *",
        [email, password, username]
    );

    const user = rows[0];
    return user;
};

export default { createUser };
