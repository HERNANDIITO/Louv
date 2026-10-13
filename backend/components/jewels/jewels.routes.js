import express from "express";
import * as controller from "./jewels.controller.js";
import { JewelCreationSchema } from "./jewels.validators.js";
import {
    validateJsonContentType,
    setJsonContentType,
    authenticateAccessToken,
    isAdmin,
    validateRequestData
} from "../../middlewares/index.js";

const jewelsRouter = express.Router();
jewelsRouter.use(validateJsonContentType);
jewelsRouter.use(setJsonContentType);

jewelsRouter.get(
    "/", 
    authenticateAccessToken,
    isAdmin,
    controller.getJewels
);

jewelsRouter.get(
    "/shared", 
    authenticateAccessToken,
    isAdmin,
    controller.getSharedJewels
);

jewelsRouter.get(
    "/shared/:sharedHash",
    controller.getJewelBySharedHash
);

jewelsRouter.get(
    "/:jewelId",
    authenticateAccessToken,
    isAdmin,
    controller.getJewelById
);

jewelsRouter.post(
    "/", 
    authenticateAccessToken,
    validateRequestData(JewelCreationSchema),
    controller.postJewel
);

jewelsRouter.post(
    "/price-quote", 
    validateRequestData(JewelCreationSchema),
    controller.getPriceQuote
);

jewelsRouter.put(
    "/:jewelId", 
    authenticateAccessToken,
    isAdmin,
    controller.updateJewelById
);

jewelsRouter.delete(
    "/:jewelId", 
    authenticateAccessToken,
    isAdmin,
    controller.deleteJewelById
);

export default jewelsRouter;
