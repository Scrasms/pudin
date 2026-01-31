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
        [username],
    );
    return rows[0];
};

/**
 *  Gets all users from the database, applying pagination, sorting and filters
 * @param {number} [limit] - how many users to display in one page
 * @param {number} [offset] - the offset from the beginning of the users (a.k.a the page)
 * @param {string} [searchQuery] - only display users with usernames that start with the searchQuery
 * @returns users in the desired page, order and filter
 */
const getAllUsers = async (limit, offset, searchQuery) => {
    let queryStr = `
        SELECT
            uid,
            email,
            username,
            profile_image,
            joined_at
        FROM Users
    `;

    const params = [];
    let paramIdx = 1;

    if (searchQuery) {
        searchQuery += "%";
        queryStr += ` WHERE username ILIKE $${paramIdx++}`;
        params.push(searchQuery);
    }

    // Alphabetical order by username
    queryStr += ` ORDER BY username ASC`;

    if (limit || limit === 0) {
        queryStr += ` LIMIT $${paramIdx++}`;
        params.push(limit);
    }

    if (offset) {
        queryStr += ` OFFSET $${paramIdx++}`;
        params.push(offset);
    }

    const { rows } = await pool.query(queryStr, params);

    return rows;
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
        [email, password, username],
    );

    return rows[0].uid;
};

/**
 * Deletes user from User table
 * @param {string} username - user's unqiue username
 * @returns true if user was deleted and false otherwise
 */
const deleteUser = async (username) => {
    const { rowCount } = await pool.query(
        "DELETE FROM Users WHERE username = $1",
        [username],
    );

    return rowCount > 0;
};

/**
 * Deletes all sessions belonging to provided user
 * @param {uuid} uid - uid of user
 * @returns true if sessions were deleted and false otherwise
 */
const deleteUserSessions = async (uid) => {
    const { rowCount } = await pool.query(
        "DELETE FROM Session WHERE (sess->'passport'->>'user')::uuid = $1",
        [uid],
    );

    return rowCount > 0;
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
            [uid, code],
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
        [uid],
    );

    return rows;
};

/**
 * Deletes the user's reset code from the DB
 * @param {uuid} uid - the user's uid
 * @param {string} code - the (hashed) reset code to be deleted
 * @returns true if reset code was deleted and false otherwise
 */
const deleteUserResetCode = async (uid, code) => {
    const { rowCount } = await pool.query(
        "DELETE FROM UserResetCodes WHERE uid = $1 AND code = $2",
        [uid, code],
    );

    return rowCount > 0;
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
 * @param {string} profileLink - link to the user's new profile image
 */
const updateUserProfile = async (uid, profileLink) => {
    await pool.query("UPDATE Users SET profile_image = $1 WHERE uid = $2", [
        profileLink,
        uid,
    ]);
};

/**
 * Saves a book for the user
 * @param {uuid} uid - user's uid
 * @param {uuid} bid - book's bid
 */
const createUserBookSave = async (uid, bid) => {
    await pool.query("INSERT INTO BookSaves (uid, bid) VALUES ($1, $2)", [
        uid,
        bid,
    ]);
};

export {
    createUser,
    getUserById,
    getUserByUsername,
    getAllUsers,
    deleteUser,
    deleteUserSessions,
    createUserResetCodes,
    getUserResetCodes,
    deleteUserResetCode,
    updateUserPassword,
    updateUserProfile,
    createUserBookSave,
};
