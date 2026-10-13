import * as BoxDetailMaterialService from './box-detail-material.service.js';

export const postBoxDetailMaterial = async (req, res) => {
    const detailMaterial = await BoxDetailMaterialService.createBoxDetailMaterial({
        boxDetailMaterialData: req.body,
    });
    res.status(201).json({ result: 'OK', detailMaterial });
};

export const updateBoxDetailMaterialById = async (req, res) => {
    const detailMaterial = await BoxDetailMaterialService.updateBoxDetailMaterialById({
        boxDetailMaterialId: req.params.detailMaterialId,
        boxDetailMaterialUpdateData: req.body,
    });
    res.status(200).json({ result: 'OK', detailMaterial });
};

export const deleteBoxDetailMaterialById = async (req, res) => {
    await BoxDetailMaterialService.deleteBoxDetailMaterialById({
        boxDetailMaterialId: req.params.detailMaterialId,
    });
    res.status(204).end();
};
