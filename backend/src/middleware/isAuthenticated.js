const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    // TODO: Update to next(err) when error handler is written
    res.status(401).json({ success: false, message: "User is not authenticated" });
}

export default isAuthenticated;