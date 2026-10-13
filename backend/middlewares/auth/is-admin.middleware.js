import createError from "http-errors";

const isAdmin = (req, res, next) => {
    if (!req.session?.isAdmin) {
        return next(createError.Forbidden("Lo sentimos, no tienes los permisos necesarios."));
    }
    next();
};

export default isAdmin;
