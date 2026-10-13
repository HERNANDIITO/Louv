import * as BaseStructureService from './baseStructures.service.js';

export const getBaseStructures = async (req, res) => {
    const baseStructures = await BaseStructureService.findBaseStructures();
    res.status(200).json({ result: 'OK', baseStructures });
};

export const getBaseStructureById = async (req, res) => {
    const baseStructure = await BaseStructureService.findBaseStructureById({
        baseStructureId: req.params.baseStructureId,
    });
    res.status(201).json({ result: 'OK', baseStructure });
};

export const postBaseStructure = async (req, res) => {
    const baseStructure = await BaseStructureService.createBaseStructure({
        baseStructureData: req.body,
    });
    res.status(201).json({ result: 'OK', baseStructure });
};

export const deleteBaseStructureById = async (req, res) => {
    await BaseStructureService.deleteBaseStructureById({ baseStructureId: req.params.baseStructureId });
    res.status(204).end();
};
