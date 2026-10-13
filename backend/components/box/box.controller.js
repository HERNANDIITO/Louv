import * as BoxService from './box.service.js';

export const getBoxes = async (req, res) => {
    const boxes = await BoxService.findBoxes({});
    res.status(200).json({ result: 'OK', boxes });
};

export const getInners = async (req, res) => {
    const innerMaterials = await BoxService.findInnerMaterials({});
    res.status(200).json({ result: 'OK', innerMaterials });
};
export const getOuters = async (req, res) => {
    const outerMaterials = await BoxService.findOuterrMaterials({});
    res.status(200).json({ result: 'OK', outerMaterials });
};
export const getDetails = async (req, res) => {
    const detailMaterials = await BoxService.findDetailMaterials({});
    res.status(200).json({ result: 'OK', detailMaterials });
};

export const getBoxById = async (req, res) => {
    const box = await BoxService.findBoxById({ boxId: req.params.boxId });
    res.status(200).json({ result: 'OK', box });
};

export const getBoxInnerMaterialsById = async (req, res) => {
    const innerMaterials = await BoxService.findCompatibleInnerMaterialsById({
        boxId: req.params.boxId,
    });
    res.status(200).json({ result: 'OK', innerMaterials });
};

export const getBoxOuterMaterialsById = async (req, res) => {
    const outerMaterials = await BoxService.findCompatibleOuterMaterialsById({
        boxId: req.params.boxId,
    });
    res.status(200).json({ result: 'OK', outerMaterials });
};

export const getBoxDetailMaterialsById = async (req, res) => {
    const detailMaterials = await BoxService.findCompatibleDetailMaterialsById({
        boxId: req.params.boxId,
    });
    return res.status(200).json({ result: 'OK', detailMaterials });
};

export const postBox = async (req, res) => {
    const box = await BoxService.createBox({ boxData: req.body });
    res.status(201).json({ result: 'OK', box });
};

export const updateBoxById = async (req, res) => {
    const box = await BoxService.updateBoxById({
        boxId: req.params.boxId,
        boxUpdateData: req.body,
    });
    res.status(200).json({ result: 'OK', box });
};

export const deleteBoxById = async (req, res) => {
    await BoxService.deleteBoxById({ boxId: req.params.boxId });
    res.status(204).end();
};
