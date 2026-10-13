import express from "express";
import * as controller from "./events.controller.js";
import { eventSchema } from "./events.validators.js"; // El que creamos con Zod
import {
    validateJsonContentType,
    setJsonContentType,
    validateRequestData
} from "../../middlewares/index.js";

const eventsRouter = express.Router();

eventsRouter.use(validateJsonContentType);
eventsRouter.use(setJsonContentType);

eventsRouter.post(
    '/track',
    validateRequestData(eventSchema), 
    controller.track
);

export default eventsRouter;