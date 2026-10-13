import createError from 'http-errors';
import * as BoxOuterMaterialRepository from './box-outer-material.repository.js';

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

const requireBoxOuterMaterial = async (boxOuterMaterialPromise) => {
    const boxOuterMaterial = await boxOuterMaterialPromise;
    if (!boxOuterMaterial) {
        throw createError.NotFound('Caja no encontrada.');
    }
    return boxOuterMaterial;
};

/* -------------------------------------------------------------------------- */
/*                                 USE CASES                                  */
/* -------------------------------------------------------------------------- */

export const createBoxOuterMaterial = async ({ boxOuterMaterialData }) => {
    return BoxOuterMaterialRepository.createOne(boxOuterMaterialData);
};

export const updateBoxOuterMaterialById = async ({ boxOuterMaterialId, boxOuterMaterialUpdateData }) => {
    return requireBoxOuterMaterial(BoxOuterMaterialRepository.updateOne({ _id: boxOuterMaterialId }, boxOuterMaterialUpdateData));
};

export const deleteBoxOuterMaterialById = async ({ boxOuterMaterialId }) => {
    return requireBoxOuterMaterial(BoxOuterMaterialRepository.deleteOne({ _id: boxOuterMaterialId }));
};
