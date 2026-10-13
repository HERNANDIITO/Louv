import mongoose from "mongoose";
import createError from "http-errors";

export const validateObjectId = (req, res, next) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(createError.BadRequest("ID de MongoDB inválido"));
    }
    next();
};
