import * as CutService from "./cuts.service.js";

// GET
export const getCuts = async (req, res) => {
    const cuts = await CutService.findCuts();
    return res.status(200).json({ result: "OK", cuts: cuts });
};

export const getCutById = async (req, res) => {
    const { cutId } = req.params;
    const cut = await CutService.findCutById(cutId);
    return res.status(200).json({ result: "OK", cut: cut });
};