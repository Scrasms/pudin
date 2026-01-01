import pool from "../../config/db.js";

/**
 * Finds and returns user with matching uid
 * @param {uuid} uid - uid of user
 * @returns the user if found or undefined otherwise
 */
const getUserById = async (uid) => {
    const { rows } = await pool.query(
        "SELECT * FROM users WHERE uid = $1",
        [uid]
    );

    return rows[0];
}

/**
 * Finds and returns user with matching username
 * @param {string} username - username of user
 * @returns the user if found or undefined otherwise
 */
const getUserByUsername = async (username) => {
    const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
    );
    return rows[0];
}

/**
 * Adds user to User table
 * @param {string} email - user's unique email
 * @param {string} password - user's (encrypted) password
 * @param {string} username - user's unique username
 * @returns the uid of the newly created user
 */
const createUser = async (email, password, username) => {
    const { rows } = await pool.query(
        "INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING uid",
        [email, password, username]
    );

    return rows[0].uid;
};

export { createUser, getUserById, getUserByUsername };
