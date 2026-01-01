import AuthError from "../errors/AuthError.js";

const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    throw new AuthError();
};

export default isAuth;
