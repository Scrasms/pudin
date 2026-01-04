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

export { generateResetCodes, hashResetCodes};
