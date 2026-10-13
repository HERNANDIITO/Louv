import * as JewelService from './jewels.service.js';

export const getJewels = async (req, res) => {
    const jewels = await JewelService.findJewels();
    return res.status(200).json({ result: 'OK', jewels });
};

export const getSharedJewels = async (req, res) => {
    const jewels = await JewelService.findSharedJewels();
    return res.status(200).json({ result: 'OK', jewels });
};

export const getJewelBySharedHash = async (req, res) => {
    const jewel = await JewelService.findJewelByHash( req.params.sharedHash );
    return res.status(200).json({ result: 'OK', jewel });
};

export const getJewelById = async (req, res) => {
    const jewel = await JewelService.findJewelById({ jewelId: req.params.jewelId });
    return res.status(200).json({ result: 'OK', jewel });
};

export const getPriceQuote = async (req, res) => {
    const quote = await JewelService.getJewelPriceQuote({ jewelData: req.body });
    return res.status(200).json({ result: 'OK', quote });
};

export const postJewel = async (req, res) => {
    const jewel = await JewelService.createJewel({ userId: req.session._id, jewelData: req.body });
    return res.status(201).json({ result: 'OK', jewel });
};

export const updateJewelById = async (req, res) => {
    const jewel = await JewelService.updateJewelById({
        jewelId: req.params.jewelId,
        jewelUpdateData: req.body,
    });
    return res.status(200).json({ result: 'OK', jewel });
};

export const deleteJewelById = async (req, res) => {
    await JewelService.deleteJewelById({ jewelId: req.params.jewelId });
    return res.status(204).end();
};
