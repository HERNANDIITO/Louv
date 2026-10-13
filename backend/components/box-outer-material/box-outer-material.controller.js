import * as BoxOuterMaterialService from './box-outer-material.service.js';

export const postBoxOuterMaterial = async (req, res) => {
    const outerMaterial = await BoxOuterMaterialService.createBoxOuterMaterial({
        boxOuterMaterialData: req.body,
    });
    res.status(201).json({ result: 'OK', outerMaterial });
};

export const updateBoxOuterMaterialById = async (req, res) => {
    const outerMaterial = await BoxOuterMaterialService.updateBoxOuterMaterialById({
        boxOuterMaterialId: req.params.boxOuterMaterialId,
        boxOuterMaterialUpdateData: req.body,
    });
    res.status(200).json({ result: 'OK', outerMaterial });
};

export const deleteBoxOuterMaterialById = async (req, res) => {
    await BoxOuterMaterialService.deleteBoxOuterMaterialById({
        boxOuterMaterialId: req.params.boxOuterMaterialId,
    });
    res.status(204).end();
};
