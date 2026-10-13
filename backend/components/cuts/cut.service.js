import createError from 'http-errors';
import * as CutRepository from './cut.repository.js';

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

const requireCut = async (cutPromise) => {
    const cut = await cutPromise;
    if (!cut) throw createError.NotFound('Corte no encontrado.');
    return cut;
};

/* -------------------------------------------------------------------------- */
/*                                 USE CASES                                  */
/* -------------------------------------------------------------------------- */

export const findCuts = async () => {
    return CutRepository.findMany();
};

export const findCutById = async ({ cutId }) => {
    return requireCut(CutRepository.findOne(cutId));
};
