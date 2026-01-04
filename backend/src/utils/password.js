/**
 * Validates the given password
 * @param {string} password - password to be validated
 * @returns error string if invalid and undefined if valid
 */
const validatePassword = (password) => {
    if (password.length < 12) {
        return "Password must be at least 12 characters long";
    }

    if (!/[a-z]/.test(password)) {
        return "Password must contain at least 1 lowercase letter";
    }

    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least 1 uppercase letter";
    }

    if (!/[0-9]/.test(password)) {
        return "Password must contain at least 1 number";
    }

    if (!/[^a-zA-Z0-9]/.test(password)) {
        return "Password must contain at least 1 special character";
    }
};

export { validatePassword };