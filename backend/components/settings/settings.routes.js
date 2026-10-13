import express from "express";
import * as controller from "./settings.controller.js";
import {
    validateJsonContentType,
    setJsonContentType,
    authenticateAccessToken,
    isAdmin,
} from "../../middlewares/index.js";

const settingsRouter = express.Router();
settingsRouter.use(validateJsonContentType);
settingsRouter.use(setJsonContentType);

settingsRouter.get(
    "/", 
    controller.getSettings
);

settingsRouter.get(
    "/:settingId", 
    controller.getSettingById
);

settingsRouter.post(
    "/", 
    authenticateAccessToken, 
    isAdmin, 
    controller.postSetting
);

settingsRouter.put(
    "/:settingId", 
    authenticateAccessToken, 
    isAdmin, 
    controller.updateSettingById
);

settingsRouter.delete(
    "/:settingId", 
    authenticateAccessToken, 
    isAdmin,
    controller.deleteSettingById
);

export default settingsRouter;
