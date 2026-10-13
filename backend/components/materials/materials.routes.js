import express from "express";
import * as controller from "./materials.controller.js";
import {
    validateJsonContentType,
    setJsonContentType,
    authenticateAccessToken,
    isAdmin,
} from "../../middlewares/index.js";

const materialsRouter = express.Router();
materialsRouter.use(validateJsonContentType);
materialsRouter.use(setJsonContentType);

materialsRouter.get(
    "/",
    controller.getMaterials
);

materialsRouter.get(
    "/:materialId",
    controller.getMaterialById
);

materialsRouter.post(
    "/",
    authenticateAccessToken,
    isAdmin,
    controller.postMaterial
);

materialsRouter.put(
    "/:materialId",
    authenticateAccessToken,
    isAdmin,
    controller.updateMaterialById
);

materialsRouter.delete(
    "/:materialId",
    authenticateAccessToken,
    isAdmin,
    controller.deleteMaterialById
);

export default materialsRouter;
