const errorHandler = (err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        success: false,
        error: {
            code: err.name,
            message: err.message,
        }
    });
};

export default errorHandler;
