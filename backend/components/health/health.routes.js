import express from "express";
import * as controller from "./health.controller.js";
import {
    validateJsonContentType,
    setJsonContentType,
} from "../../middlewares/index.js";

const healthRouter = express.Router();
healthRouter.use(validateJsonContentType);
healthRouter.use(setJsonContentType);

healthRouter.get(
    "/",
    controller.checkPID
);

export default healthRouter;
