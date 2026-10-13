import express from "express";
import * as controller from "./orders.controller.js";
import { CreateOrderSchema } from "./orders.validators.js";
import {
    validateJsonContentType,
    setJsonContentType,
    authenticateAccessToken,
    isAdmin,
    validateRequestData,
} from "../../middlewares/index.js";

const ordersRouter = express.Router();
ordersRouter.use(validateJsonContentType);
ordersRouter.use(setJsonContentType);

ordersRouter.get(
    "/",
    authenticateAccessToken,
    isAdmin,
    controller.getOrders
);

ordersRouter.get(
    "/:orderId",
    authenticateAccessToken,
    isAdmin,
    controller.getOrderById
)

ordersRouter.post(
    "/",
    validateRequestData(CreateOrderSchema),
    authenticateAccessToken,
    controller.postOrder
);

ordersRouter.post(
    "/:orderId/jewel/:jewelId",
    authenticateAccessToken,
    controller.copyJewelIntoOrder
);

ordersRouter.put(
    "/:orderId",
    authenticateAccessToken,
    isAdmin,
    controller.updateOrderById
);

ordersRouter.delete(
    "/:orderId",
    authenticateAccessToken,
    isAdmin,
    controller.deleteOrderById
);

export default ordersRouter;
