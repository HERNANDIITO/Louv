import * as GemstoneService from './gemstones.service.js';

export const getGemstones = async (req, res) => {
    const gemstones = await GemstoneService.findGemstones({ query: req.query });
    res.status(200).json({ result: 'OK', gemstones });
};

export const getGemstoneById = async (req, res) => {
    const gemstone = await GemstoneService.findGemstoneById({ gemstoneId: req.params.gemstoneId });
    res.status(200).json({ result: 'OK', gemstone });
};

export const postGemstone = async (req, res) => {
    const gemstone = await GemstoneService.createGemstone({ gemstoneData: req.body });
    res.status(201).json({ result: 'OK', gemstone });
};

export const updateGemstoneById = async (req, res) => {
    const gemstone = await GemstoneService.updateGemstoneById({
        gemstoneId: req.params.gemstoneId,
        gemstoneUpdateData: req.body,
    });
    res.status(200).json({ result: 'OK', gemstone });
};

export const deleteGemstoneById = async (req, res) => {
    await GemstoneService.deleteGemstoneById({ gemstoneId: req.params.gemstoneId });
    res.status(204).end();
};
