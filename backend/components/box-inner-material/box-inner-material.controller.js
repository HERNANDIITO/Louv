import * as BoxInnerMaterialService from './box-inner-material.service.js';

export const postBoxInnerMaterial = async (req, res) => {
    const innerMaterial = await BoxInnerMaterialService.createBoxInnerMaterial({
        boxInnerMaterialData: req.body,
    });
    res.status(201).json({ result: 'OK', innerMaterial });
};

export const updateBoxInnerMaterialById = async (req, res) => {
    const innerMaterial = await BoxInnerMaterialService.updateBoxInnerMaterialById({
        boxInnerMaterialId: req.params.boxInnerMaterialId,
        boxInnerMaterialUpdateData: req.body,
    });
    res.status(200).json({ result: 'OK', innerMaterial });
};

export const deleteBoxInnerMaterialById = async (req, res) => {
    await BoxInnerMaterialService.deleteBoxInnerMaterialById({
        boxInnerMaterialId: req.params.boxInnerMaterialId,
    });
    res.status(204).end();
};
