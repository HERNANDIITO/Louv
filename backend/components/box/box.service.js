import createError from 'http-errors';
import * as BoxRepository from './box.repository.js';

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

const requireBox = async (boxPromise) => {
    const box = await boxPromise;
    if (!box) throw createError.NotFound('Caja no encontrada.');
    return box;
};

/* -------------------------------------------------------------------------- */
/*                                 USE CASES                                  */
/* -------------------------------------------------------------------------- */

export const findBoxes = async () => {
    return BoxRepository.findMany();
};

export const findBoxById = async ({ boxId }) => {
    return requireBox(BoxRepository.findOne(boxId));
};

export const findCompatibleInnerMaterialsById = async ({ boxId }) => {
    const boxPromise = BoxRepository.findCompatibleMaterials({ _id: boxId }, 'innerMaterials');
    const box = await requireBox(boxPromise);
    return box.innerMaterials;
};

export const findInnerMaterials = async () => {
    return BoxRepository.findManyInners();
}

export const findOuterrMaterials = async () => {
    return BoxRepository.findManyOuters();
}

export const findDetailMaterials = async () => {
    return BoxRepository.findManyDetails();
}

export const findCompatibleOuterMaterialsById = async ({ boxId }) => {
    const boxPromise = BoxRepository.findCompatibleMaterials({ _id: boxId }, 'outerMaterials');
    const box = await requireBox(boxPromise);
    return box.outerMaterials;
};

export const findCompatibleDetailMaterialsById = async ({ boxId }) => {
    const boxPromise = BoxRepository.findCompatibleMaterials({ _id: boxId }, 'detailMaterials');
    const box = await requireBox(boxPromise);
    return box.detailMaterials;
};

export const createBox = async ({ boxData }) => {
    return BoxRepository.createOne(boxData);
};

export const updateBoxById = async ({ boxId, boxUpdateData }) => {
    return requireBox(BoxRepository.updateOne({ _id: boxId }, boxUpdateData));
};

export const deleteBoxById = async ({ boxId }) => {
    return requireBox(BoxRepository.deleteOne({ _id: boxId }));
};
