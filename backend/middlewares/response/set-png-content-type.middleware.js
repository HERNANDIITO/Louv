const setPngContentType = (req, res, next) => {
    res.type("image/png");
    next();
};

export default setPngContentType;