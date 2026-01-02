import {
    FOREIGN_KEY_VIOLATION,
    NOT_NULL_VIOLATION,
    UNIQUE_VIOLATION,
} from "../constants/dbErrors.js";

// Map postgres errors to HTTP
class DBError extends Error {
    constructor(err) {
        super(err.message);
        this.name = "DBError";

        const errCode = Number(err.code);

        // TODO: extend to more errors
        switch (errCode) {
            case UNIQUE_VIOLATION:
                this.status = 409;
                if (
                    err.detail.includes("username") ||
                    err.detail.includes("email")
                ) {
                    this.message =
                        "A user with this username or email already exists";
                } else {
                    const key = this.#getKey(err.detail);
                    this.message = `A ${err.table} with this ${key} already exists`;
                }
                break;
            case NOT_NULL_VIOLATION:
                this.status = 400;
                break;
            case FOREIGN_KEY_VIOLATION:
                this.status = 400;
                break;
        }
    }

    // Extract key from error detail message
    #getKey(detail) {
        let key = detail.split(" ")[1].split("=")[0];
        key = key.slice(1, key.length - 1);
        return key;
    }
}

export default DBError;
