import express from "express";
import * as controller from "./cut.controller.js";
import {
    validateJsonContentType,
    setJsonContentType,
    authenticateAccessToken,
    isAdmin,
} from "../../middlewares/index.js";

const cutRouter = express.Router();
cutRouter.use(validateJsonContentType);
cutRouter.use(setJsonContentType);

cutRouter.get(
    "/", 
    controller.getCuts
);

cutRouter.get(
    "/:cutId", 
    controller.getCutById
);

export default cutRouter;
