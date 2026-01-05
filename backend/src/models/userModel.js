import pool from "../../config/db.js";

/**
 * Finds and returns user with matching uid
 * @param {uuid} uid - uid of user
 * @returns the user if found or undefined otherwise
 */
const getUserById = async (uid) => {
    const { rows } = await pool.query("SELECT * FROM Users WHERE uid = $1", [
        uid,
    ]);

    return rows[0];
};

/**
 * Finds and returns user with matching username
 * @param {string} username - username of user
 * @returns the user if found or undefined otherwise
 */
const getUserByUsername = async (username) => {
    const { rows } = await pool.query(
        "SELECT * FROM Users WHERE username = $1",
        [username]
    );
    return rows[0];
};

/**
 * Adds user to User table
 * @param {string} email - user's unique email
 * @param {string} password - user's (encrypted) password
 * @param {string} username - user's unique username
 * @returns the uid of the newly created user
 */
const createUser = async (email, password, username) => {
    const { rows } = await pool.query(
        "INSERT INTO Users (email, password, username) VALUES ($1, $2, $3) RETURNING uid",
        [email, password, username]
    );

    return rows[0].uid;
};

/**
 * Deletes user from User table
 * @param {string} username - user's unqiue username
 */
const deleteUser = async (username) => {
    await pool.query("DELETE FROM Users WHERE username = $1", [username]);
};

/**
 * Deletes all sessions belonging to provided user
 * @param {uuid} uid - uid of user
 */
const deleteUserSessions = async (uid) => {
    await pool.query(
        "DELETE FROM Session WHERE (sess->'passport'->>'user')::uuid = $1",
        [uid]
    );
};

/**
 * Adds the user's password reset codes to the DB
 * @param {uuid} uid - the user
 * @param {string[]} codes - the hashed codes
 */
const createUserResetCodes = async (uid, codes) => {
    for (const code of codes) {
        await pool.query(
            "INSERT INTO UserResetCodes (uid, code) VALUES ($1, $2)",
            [uid, code]
        );
    }
};

/**
 * Finds and returns the user's hashed password reset codes
 * @param {uuid} uid - the user's uid
 * @returns the user's hashed codes
 */
const getUserResetCodes = async (uid) => {
    const { rows } = await pool.query(
        "SELECT code FROM UserResetCodes WHERE uid = $1",
        [uid]
    );
    return rows;
};

/**
 * Deletes the user's reset code from the DB
 * @param {uuid} uid - the user's uid
 * @param {string} code - the (hashed) reset code to be deleted
 */
const deleteUserResetCode = async (uid, code) => {
    await pool.query(
        "DELETE FROM UserResetCodes WHERE uid = $1 AND code = $2",
        [uid, code]
    );
};

/**
 * Updates the user's password
 * @param {uuid} uid - the user's uid
 * @param {string} newPassword - the user's new password
 */
const updateUserPassword = async (uid, newPassword) => {
    await pool.query("UPDATE Users SET password = $1 WHERE uid = $2", [
        newPassword,
        uid,
    ]);
};

/**
 * Updates the user's profile image
 * @param {uuid} uid - the user's uid
 * @param {text} profileLink - link to the user's new profile image
 */
const updateUserProfile = async (uid, profileLink) => {
    await pool.query("UPDATE Users SET profile_image = $1 WHERE uid = $2", [
        profileLink,
        uid,
    ]);
};

export {
    createUser,
    getUserById,
    getUserByUsername,
    deleteUser,
    deleteUserSessions,
    createUserResetCodes,
    getUserResetCodes,
    deleteUserResetCode,
    updateUserPassword,
    updateUserProfile
};
