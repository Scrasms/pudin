import crypto from "crypto";
import bcrypt from "bcryptjs";

/**
 * Generates password reset codes for the user
 * @param {number} n - number of codes to generate
 * @returns the generated codes
 */
const generateResetCodes = (n) => {
    const codes = [];

    for (let i = 0; i < n; i++) {
        const code = crypto.randomBytes(6).toString("hex");
        codes.push(code);
    }

    return codes;
};

/**
 * Hashes the given codes
 * @param {string[]} codes - the codes to hash
 * @returns the hashed codes
 */
const hashResetCodes = async (codes) => {
    const hashedCodes = [];

    for (const code of codes) {
        const hashedCode = await bcrypt.hash(code, 10);
        hashedCodes.push(hashedCode);
    }

    return hashedCodes;
};

/**
 * Finds the hashed code on the DB that matches with the user's provided code
 * @param {string[]} hashedCodes - the codes stored on the DB
 * @param {string} userCode - the user's provided code
 * @returns the matching hashed code if found or undefined otherwise
 */
const getMatchingResetCode = async (hashedCodes, userCode) => {
    for (const obj of hashedCodes) {
        const match = await bcrypt.compare(userCode, obj.code);
        if (match) {
            return obj.code;
        }
    }
};

export { generateResetCodes, hashResetCodes, getMatchingResetCode };
