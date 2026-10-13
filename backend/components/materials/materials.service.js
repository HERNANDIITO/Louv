import createError from 'http-errors';
import * as MaterialRepository from './materials.repository.js';

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

const requireMaterial = async (materialPromise) => {
    const material = await materialPromise;
    if (!material) throw createError.NotFound('Gema no encontrada.');
    return material;
};

/* -------------------------------------------------------------------------- */
/*                                 USE CASES                                  */
/* -------------------------------------------------------------------------- */

export const findMaterials = async () => {
    return MaterialRepository.findMany();
};

export const findMaterialById = async ({ materialId }) => {
    return requireMaterial(MaterialRepository.findOne({ _id: materialId }));
};

export const createMaterial = async ({ materialData }) => {
    return MaterialRepository.createOne(materialData);
};

export const updateMaterialById = async ({ materialId, materialUpdateData }) => {
    return requireMaterial(MaterialRepository.updateOne({ _id: materialId }, materialUpdateData));
};

export const deleteMaterialById = async ({ materialId }) => {
    return requireMaterial(MaterialRepository.deleteOne({ _id: materialId }));
};
