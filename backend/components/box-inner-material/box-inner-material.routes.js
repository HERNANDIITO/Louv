import express from "express";
import * as controller from "./box-inner-material.controller.js";
import {
    validateJsonContentType,
    setJsonContentType,
    authenticateAccessToken,
    isAdmin,
} from "../../middlewares/index.js";

const boxInnerMaterialRouter = express.Router();
boxInnerMaterialRouter.use(validateJsonContentType);
boxInnerMaterialRouter.use(setJsonContentType);

boxInnerMaterialRouter.post(
    "/", 
    authenticateAccessToken,
    isAdmin, 
    controller.postBoxInnerMaterial
);

boxInnerMaterialRouter.put(
    "/:boxInnerMaterialId", 
    authenticateAccessToken, 
    isAdmin, 
    controller.updateBoxInnerMaterialById
);

boxInnerMaterialRouter.delete(
    "/:boxInnerMaterialId", 
    authenticateAccessToken, 
    isAdmin, 
    controller.deleteBoxInnerMaterialById
);

export default boxInnerMaterialRouter;
