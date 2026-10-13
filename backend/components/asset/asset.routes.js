import express from 'express';
import * as controller from './asset.controller.js';
import {} from '../../middlewares/index.js';

const assetRouter = express.Router();

assetRouter.get(
    '/:assetName',
    controller.getAsset
);

export default assetRouter;
