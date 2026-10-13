import * as SizeService from './sizes.service.js';

export const getSizes = async (req, res) => {
    const sizes = await SizeService.findSizes();
    res.status(200).json({ result: 'OK', sizes });
};

export const getSizeById = async (req, res) => {
    const size = await SizeService.findSizeById({ sizeId: req.params.sizeId });
    return res.status(200).json({ result: 'OK', size });
};
