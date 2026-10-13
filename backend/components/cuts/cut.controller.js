import * as CutService from './cut.service.js';

export const getCuts = async (req, res) => {
    const cuts = await CutService.findCuts({});
    res.status(200).json({ result: 'OK', cuts });
};

export const getCutById = async (req, res) => {
    const cut = await CutService.findCutById({ cutId: req.params.cutId });
    res.status(200).json({ result: 'OK', cut });
};
