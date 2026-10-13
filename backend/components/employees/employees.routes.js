import express from "express";
import * as controller from "./employees.controller.js";
import {
    validateJsonContentType,
    setJsonContentType,
    authenticateAccessToken,
    isAdmin,
} from "../../middlewares/index.js";


const employeesRouter = express.Router();
employeesRouter.use(validateJsonContentType);
employeesRouter.use(setJsonContentType);

employeesRouter.get(
    "/",
    authenticateAccessToken,
    isAdmin,
    controller.getEmployees
);

employeesRouter.get(
    "/:employeeId",
    authenticateAccessToken,
    isAdmin,
    controller.getEmployeeById
);

employeesRouter.post(
    "/",
    authenticateAccessToken,
    isAdmin,
    controller.postEmployee
);

employeesRouter.put(
    "/:employeeId",
    authenticateAccessToken,
    isAdmin,
    controller.updateEmployeeById
);

employeesRouter.delete(
    "/:employeeId",
    authenticateAccessToken,
    isAdmin,
    controller.deleteEmployeeById
);

export default employeesRouter;
