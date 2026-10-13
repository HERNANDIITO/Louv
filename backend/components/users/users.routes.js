import express from "express"
import * as controller from "./users.controller.js";
import {
    validateJsonContentType,
    setJsonContentType,
    authenticateAccessToken,
    isAdmin,
} from "../../middlewares/index.js";
import meRouter from "./me/me.routes.js";

const usersRouter = express.Router();
usersRouter.use(validateJsonContentType);
usersRouter.use(setJsonContentType);
usersRouter.use("/me", meRouter);

usersRouter.get(
    "/",
    authenticateAccessToken,
    isAdmin,
    controller.getUsers
);

usersRouter.get(
    "/:userId",
    authenticateAccessToken,
    isAdmin,
    controller.getUserById
);

usersRouter.put(
    "/:userId",
    authenticateAccessToken,
    isAdmin,
    controller.updateUserById,
);

usersRouter.delete(
    "/:userId",
    authenticateAccessToken,
    isAdmin,
    controller.deleteUserById
);

export default usersRouter;
