import express from "express";
import * as controller from "./box-outer-material.controller.js";
import {
    validateJsonContentType,
    setJsonContentType,
    authenticateAccessToken,
    isAdmin,
} from "../../middlewares/index.js";

const boxOuterMaterialRouter = express.Router();
boxOuterMaterialRouter.use(validateJsonContentType);
boxOuterMaterialRouter.use(setJsonContentType);

boxOuterMaterialRouter.post(
    "/", 
    authenticateAccessToken, 
    isAdmin, 
    controller.postBoxOuterMaterial
);

boxOuterMaterialRouter.put(
    "/:boxOuterMaterialId", 
    authenticateAccessToken, 
    isAdmin,  
    controller.updateBoxOuterMaterialById
);

boxOuterMaterialRouter.delete(
    "/:boxOuterMaterialId", 
    authenticateAccessToken, 
    isAdmin, 
    controller.deleteBoxOuterMaterialById
);

export default boxOuterMaterialRouter;
