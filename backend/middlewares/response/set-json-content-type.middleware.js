const setJsonContentType = (req, res, next) => {
    res.type("application/json");
    next();
};

export default setJsonContentType;