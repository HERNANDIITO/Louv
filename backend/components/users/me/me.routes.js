import express from 'express';
import * as controller from './me.controller.js';
import {
    DeleteAccountSchema,
    UpdateAccountSchema,
    UpdateAccountPasswordSchema,
} from './me.validators.js';
import {
    JewelCreationSchema,
    JewelNameUpdateSchema,
} from '../../jewels/jewels.validators.js';
import {
    validateJsonContentType,
    setPngContentType,
    setPdfContentType,
    setJsonContentType,
    authenticateAccessToken,
    validateRequestData,
} from '../../../middlewares/index.js';

const meRouter = express.Router();

meRouter.get(
    '/jewels',
    authenticateAccessToken,
    setJsonContentType,
    controller.getJewels
);

meRouter.get(
    '/jewels/:jewelId',
    authenticateAccessToken,
    setJsonContentType,
    controller.getJewelById
);

meRouter.get(
    '/jewels/:jewelId/photo',
    authenticateAccessToken,
    setPngContentType,
    controller.getPhotoOfMyJewelByJewelId,
);

meRouter.get(
    '/jewels/:jewelId/pdf',
    authenticateAccessToken,
    setPdfContentType,
    controller.getPDFOfMyJewelByJewelId,
);

meRouter.get(
    '/orders',
    authenticateAccessToken,
    setJsonContentType,
    controller.getOrders
);

meRouter.get(
    '/orders/:orderId',
    authenticateAccessToken,
    setJsonContentType,
    controller.getOrderById
);

meRouter.get(
    '/orders/:orderId/:productId/photo',
    authenticateAccessToken,
    setJsonContentType,
    controller.getPhotoOfMyJewelByOrderProductId
);

meRouter.post(
    '/delete',
    validateJsonContentType,
    authenticateAccessToken,
    validateRequestData(DeleteAccountSchema),
    setJsonContentType,
    controller.deleteUserById
);

meRouter.put(
    '/',
    validateJsonContentType,
    authenticateAccessToken,
    validateRequestData(UpdateAccountSchema),
    controller.updateUserById,
    setJsonContentType
);

meRouter.put(
    '/jewels/:jewelId',
    validateJsonContentType,
    authenticateAccessToken,
    validateRequestData(JewelCreationSchema),
    controller.updateJewelById,
    setJsonContentType
);

meRouter.put(
    '/jewels/:jewelId/name',
    validateJsonContentType,
    authenticateAccessToken,
    validateRequestData(JewelNameUpdateSchema),
    controller.updateJewelNameById,
    setJsonContentType
);

meRouter.put(
    '/jewels/:jewelId/shareHashWithPrice',
    validateJsonContentType,
    authenticateAccessToken,
    controller.updateJewelShareHashWithPriceById,
    setJsonContentType
);

meRouter.put(
    '/jewels/:jewelId/shareHashWithoutPrice',
    validateJsonContentType,
    authenticateAccessToken,
    controller.updateJewelShareHashWithoutPriceById,
    setJsonContentType
);

meRouter.delete(
    '/jewels/:jewelId',
    authenticateAccessToken,
    setJsonContentType,
    controller.deleteJewelById
);
meRouter.delete(
    '/orders/:orderId',
    authenticateAccessToken,
    setJsonContentType,
    controller.deleteOrderById
);

export default meRouter;
