import express from "express";
import * as controller from "./baseStructures.controller.js";
import {
    validateJsonContentType,
    setJsonContentType,
    authenticateAccessToken,
    isAdmin,
} from "../../middlewares/index.js";


const baseStructuresRouter = express.Router();
baseStructuresRouter.use(validateJsonContentType);
baseStructuresRouter.use(setJsonContentType);

baseStructuresRouter.get(
    "/",
    controller.getBaseStructures
);

baseStructuresRouter.get(
    "/:baseStructureId",
    controller.getBaseStructureById
)

baseStructuresRouter.post(
    "/",
    authenticateAccessToken,
    isAdmin,
    controller.postBaseStructure
);

baseStructuresRouter.delete(
    "/:baseStructureId",
    authenticateAccessToken,
    isAdmin,
    controller.deleteBaseStructureById
);

export default baseStructuresRouter;
