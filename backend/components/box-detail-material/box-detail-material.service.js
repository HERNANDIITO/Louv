import createError from 'http-errors';
import * as BoxDetailMaterialRepository from './box-detail-material.repository.js';

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

const requireBoxDetailMaterial = async (boxDetailMaterialPromise) => {
    const boxDetailMaterial = await boxDetailMaterialPromise;
    if (!boxDetailMaterial) {
        throw createError.NotFound('Caja no encontrada.');
    }
    return boxDetailMaterial;
};

/* -------------------------------------------------------------------------- */
/*                                 USE CASES                                  */
/* -------------------------------------------------------------------------- */

export const createBoxDetailMaterial = async ({ boxDetailMaterialData }) => {
    return BoxDetailMaterialRepository.createOne(boxDetailMaterialData);
};

export const updateBoxDetailMaterialById = async ({ boxDetailMaterialId, boxDetailMaterialUpdateData }) => {
    return requireBoxDetailMaterial(BoxDetailMaterialRepository.updateOne({ _id: boxDetailMaterialId }, boxDetailMaterialUpdateData));
};

export const deleteBoxDetailMaterialById = async ({ boxDetailMaterialId }) => {
    return requireBoxDetailMaterial(BoxDetailMaterialRepository.deleteOne({ _id: boxDetailMaterialId }));
};
