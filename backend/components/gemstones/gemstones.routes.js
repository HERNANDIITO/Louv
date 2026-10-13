import express from "express";
import * as controller from "./gemstones.controller.js";
import {
    validateJsonContentType,
    setJsonContentType,
    authenticateAccessToken,
    isAdmin,
} from "../../middlewares/index.js";

const gemstonesRouter = express.Router();
gemstonesRouter.use(validateJsonContentType);
gemstonesRouter.use(setJsonContentType);

gemstonesRouter.get(
    "/",
    controller.getGemstones
);

gemstonesRouter.get(
    "/:gemstoneId",
    controller.getGemstoneById
);

gemstonesRouter.post(
    "/", authenticateAccessToken,
    isAdmin,
    controller.postGemstone
);

gemstonesRouter.put(
    "/:gemstoneId",
    authenticateAccessToken,
    isAdmin,
    controller.updateGemstoneById
);

gemstonesRouter.delete(
    "/:gemstoneId",
    authenticateAccessToken,
    isAdmin,
    controller.deleteGemstoneById
);

export default gemstonesRouter;
