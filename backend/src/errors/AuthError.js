class AuthError extends Error {
    constructor(message) {
        super(message);
        this.status = 401;
        this.name = "AuthError";
        this.message = message || "User is not authenticated";
    }
}

export default AuthError;
