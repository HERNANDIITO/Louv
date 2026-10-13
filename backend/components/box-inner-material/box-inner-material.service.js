import createError from 'http-errors';
import * as BoxInnerMaterialRepository from './box-inner-material.repository.js';

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

const requireBoxInnerMaterial = async (boxInnerMaterialPromise) => {
    const boxInnerMaterial = await boxInnerMaterialPromise;
    if (!boxInnerMaterial) {
        throw createError.NotFound('Caja no encontrada.');
    }
    return boxInnerMaterial;
};

/* -------------------------------------------------------------------------- */
/*                                 USE CASES                                  */
/* -------------------------------------------------------------------------- */

export const createBoxInnerMaterial = async ({ boxInnerMaterialData }) => {
    return BoxInnerMaterialRepository.createOne(boxInnerMaterialData);
};

export const updateBoxInnerMaterialById = async ({ boxInnerMaterialId, boxInnerMaterialUpdateData }) => {
    return requireBoxInnerMaterial(BoxInnerMaterialRepository.updateOne({ _id: boxInnerMaterialId }, boxInnerMaterialUpdateData));
};

export const deleteBoxInnerMaterialById = async ({ boxInnerMaterialId }) => {
    return requireBoxInnerMaterial(BoxInnerMaterialRepository.deleteOne({ _id: boxInnerMaterialId }));
};
