import * as AssetService from './asset.service.js';

export const getAsset = async (req, res) => {
    const asset = await AssetService.getAssetByName({ assetName: req.params.assetName, });
    res.status(201).json({ result: 'OK', asset });
};
