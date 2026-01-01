class AuthError extends Error {
    constructor() {
        super();
        this.status = 401;
        this.name = "AuthError";
        this.message = "User is not authenticated";
    }
}

export default AuthError;
