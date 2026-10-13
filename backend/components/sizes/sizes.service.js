import createError from 'http-errors';
import * as SizeRepository from './sizes.repository.js';

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

const requireSize = async (sizePromise) => {
    const size = await sizePromise;
    if (!size) throw createError.NotFound('Gema no encontrada.');
    return size;
};

/* -------------------------------------------------------------------------- */
/*                                 USE CASES                                  */
/* -------------------------------------------------------------------------- */

export const findSizes = async () => {
    return SizeRepository.findMany();
};

export const findSizeById = async ({ sizeId }) => {
    return requireSize(SizeRepository.findOne({ _id: sizeId }));
};

