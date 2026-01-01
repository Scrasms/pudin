import * as dbErrors from "../constants/dbErrors.js";

// Map postgres errors to HTTP
class DBError extends Error {
    constructor(err) {
        super(err.message);
        this.name = "DBError";

        const errCode = Number(err.code);

        if (errCode === dbErrors.UNIQUE_VIOLATION) {
            this.status = 409;
            if (
                err.detail.includes("username") ||
                err.detail.includes("email")
            ) {
                this.message =
                    "A user with this username or email already exists";
            } else {
                let key = err.detail.split(" ")[1];
                key = key.slice(1, key.length - 1);

                this.message = `A ${err.detail.table} with this ${key} already exists`;
            }
        }

        // TODO: extend to more errors
    }
}

export default DBError;
