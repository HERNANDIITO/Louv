import express from "express";
import * as controller from "./box.controller.js";
import {
    validateJsonContentType,
    setJsonContentType,
    authenticateAccessToken,
    isAdmin,
} from "../../middlewares/index.js";

const boxRouter = express.Router();
boxRouter.use(validateJsonContentType);
boxRouter.use(setJsonContentType);

boxRouter.get(
    "/", 
    controller.getBoxes
);

boxRouter.get(
    "/innerMaterials", 
    controller.getInners
);

boxRouter.get(
    "/uuterMaterials", 
    controller.getOuters
);

boxRouter.get(
    "/detailMaterials", 
    controller.getDetails
);

boxRouter.get(
    "/:boxId", 
    controller.getBoxById
);

boxRouter.get(
    "/:boxId/innerMaterials", 
    controller.getBoxInnerMaterialsById
);
boxRouter.get(
    "/:boxId/outerMaterials", 
    controller.getBoxOuterMaterialsById
);
boxRouter.get(
    "/:boxId/detailMaterials", 
    controller.getBoxDetailMaterialsById
);

boxRouter.post(
    "/",
    authenticateAccessToken,
    isAdmin,
    controller.postBox
);

boxRouter.put(
    "/:boxId",
    authenticateAccessToken,
    isAdmin,
    controller.updateBoxById
);

boxRouter.delete(
    "/:boxId",
    authenticateAccessToken,
    isAdmin,
    controller.deleteBoxById
);

export default boxRouter;
