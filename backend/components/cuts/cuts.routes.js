// Dependencias y funciones a mapear en las rutas.
import express from "express";

// Controller
import * as controller from "./cuts.controller.js";

// Schemas de validación.
// import {
//     JewelryValidateCreationSchema,
//     JewelryValidateUpdateSchema
// } from "../../validation-schemas/jewel.vschema.js";

// Middlewares.
import {
    checkJsonContentType,
    setJsonContentType,
    createResourceErrorHandler,
    authenticateToken,
    isAdmin,
    validateRequestData
} from "../../middlewares/index.js";

// Declaraciones.
const cutsRouter = express.Router();

// Middleware global para jewels.
cutsRouter.use(checkJsonContentType);
cutsRouter.use(setJsonContentType);

// Endpoints locales (Poner siempre el / al inicio que si no da error).
// GET
cutsRouter.get(
    "/", 
    controller.getCuts
);

cutsRouter.get(
    "/:cutId",
    controller.getCutById
);

// POST

// PUT

// DELETE

// Manejador de errores local.
cutsRouter.use(createResourceErrorHandler("Cortes de gema"));

export default cutsRouter;
