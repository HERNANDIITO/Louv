const setPdfContentType = (req, res, next) => {
    res.type("application/pdf");
    next();
};

export default setPdfContentType;