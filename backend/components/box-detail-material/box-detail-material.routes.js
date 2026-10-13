import express from 'express';
import * as controller from './box-detail-material.controller.js';
import {
    validateJsonContentType,
    setJsonContentType,
    authenticateAccessToken,
    isAdmin,
} from '../../middlewares/index.js';

const boxDetailMaterialRouter = express.Router();
boxDetailMaterialRouter.use(validateJsonContentType);
boxDetailMaterialRouter.use(setJsonContentType);

boxDetailMaterialRouter.post(
    '/',
    authenticateAccessToken,
    isAdmin,
    controller.postBoxDetailMaterial
);

boxDetailMaterialRouter.put(
    '/:detailMaterialId',
    authenticateAccessToken,
    isAdmin,
    controller.updateBoxDetailMaterialById
);

boxDetailMaterialRouter.delete(
    '/:detailMaterialId',
    authenticateAccessToken,
    isAdmin,
    controller.deleteBoxDetailMaterialById
);

export default boxDetailMaterialRouter;
