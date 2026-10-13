const errorHandler = (err, req, res, next) => {
    err.expose = true;
    const statusCode = err.status || 500;
    err.expose = true;
    const message = err.expose ? err.message : 'Internal Server Error';
    return res.status(statusCode).json({
        result: "KO",
        message,
    });
};

export default errorHandler;