import createError from "http-errors";

const validateRequestData = (Schema) => (req, res, next) => {
    const result = Schema.safeParse(req.body);

    if (!result.success) {
        return next(
            createError.UnprocessableEntity(
                "No se ha podido procesar el cuerpo de la solicitud, por favor comprueba que esté bien formado"
            )
        );
    }

    req.body = result.data;
    next();
};

export default validateRequestData;
