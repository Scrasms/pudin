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
                this.#handleUnique(err);
                break;
            case NOT_NULL_VIOLATION:
                this.#handleNotNull(err);
                break;
            case FOREIGN_KEY_VIOLATION:
                this.#handleFk(err);
                break;
        }
    }

    #handleUnique(err) {
        this.status = 409;
        if (err.detail.includes("username") || err.detail.includes("email")) {
            this.message = "A user with this username or email already exists";
        } else if (
            err.detail.includes("title") &&
            err.detail.includes("written_by")
        ) {
            this.message = "User already has a book with the same title";
        } else {
            let keys = this.#getKeys(err.detail);
            keys = keys.join(" and ");
            this.message = `A ${err.table} with the same ${keys} already exists`;
        }
    }

    #handleNotNull(err) {
        this.status = 400;
        this.message = `A ${err.column} must be provided`;
    }

    #handleFk(err) {
        this.status = 404;
        if (err.detail.includes("tag_name")) {
            this.message = "No such tag found";
        } else if (err.detail.includes("bid") && err.detail.includes("number")) {
            this.message = "No such chapter found";
        } else {
            let keys = this.#getKeys(err.detail);
            keys.join(" and ");
            this.message = `No such ${keys} found in ${err.table}`;
        }
    }

    // Extract keys from error detail message
    #getKeys(detail) {
        let keys = detail.split("=")[0];
        keys = keys.slice(5, keys.length - 1);
        return keys.split(", ");
    }
}

export default DBError;
