import createError from "http-errors";

const validateJsonContentType = (req, res, next) => {
    const jsonMethods = ["POST", "PUT"];
    if (jsonMethods.includes(req.method) && !req.is("application/json")) {
        return next(
            createError.UnsupportedMediaType(
                "El tipo mime del cuerpo de la petición no está soportado por el servidor."
            )
        );
    }

    next();
};

export default validateJsonContentType;
