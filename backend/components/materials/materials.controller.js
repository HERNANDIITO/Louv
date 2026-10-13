import * as MaterialService from './materials.service.js';

export const getMaterials = async (req, res) => {
    const materials = await MaterialService.findMaterials();
    res.status(200).json({ result: 'OK', materials });
};

export const getMaterialById = async (req, res) => {
    const material = await MaterialService.findMaterialById({ materialId: req.params.materialId });
    return res.status(200).json({ result: 'OK', material });
};

export const postMaterial = async (req, res) => {
    const material = await MaterialService.createMaterial({ materialData: req.body });
    res.status(201).json({ result: 'OK', material });
};

export const updateMaterialById = async (req, res) => {
    const material = await MaterialService.updateMaterialById({
        materialId: req.params.materialId,
        materialUpdateData: req.body,
    });
    res.status(200).json({ result: 'OK', material });
};

export const deleteMaterialById = async (req, res) => {
    await MaterialService.deleteMaterialById({ materialId: req.params.materialId });
    res.status(204).end();
};
