import express from "express";
import * as controller from "./sizes.controller.js";
import {
    validateJsonContentType,
    setJsonContentType,
    authenticateAccessToken,
    isAdmin,
} from "../../middlewares/index.js";

const sizesRouter = express.Router();
sizesRouter.use(validateJsonContentType);
sizesRouter.use(setJsonContentType);

sizesRouter.get(
    "/",
    controller.getSizes
);

sizesRouter.get(
    "/:sizeId",
    controller.getSizeById
);

export default sizesRouter;
