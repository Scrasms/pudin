class InputError extends Error {
    constructor(message) {
        super(message);
        this.status = 400;
        this.name = "InputError";
        this.message = message || "Invalid input";
    }
}

export default InputError;
