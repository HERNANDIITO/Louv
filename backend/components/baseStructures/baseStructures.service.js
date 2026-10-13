import createError from 'http-errors';
import * as BaseStructureRepository from './baseStructures.repository.js';

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

const requireBaseStructure = async (baseStructurePromise) => {
    const baseStructure = await baseStructurePromise;
    if (!baseStructure) {
        throw createError.NotFound('Estructura base no encontrada.');
    }
    return baseStructure;
};

/* -------------------------------------------------------------------------- */
/*                                 USE CASES                                  */
/* -------------------------------------------------------------------------- */

export const findBaseStructures = async () => {
    return BaseStructureRepository.findMany();
};

export const findBaseStructureById = async ({ baseStructureId }) => {
    return requireBaseStructure(BaseStructureRepository.findOne({ _id: baseStructureId }));
};

export const createBaseStructure = async ({ baseStructureData }) => {
    return BaseStructureRepository.createOne(baseStructureData);
};

export const deleteBaseStructureById = async ({ baseStructureId }) => {
    return requireBaseStructure(BaseStructureRepository.deleteOne({ _id: baseStructureId }));
};
