import createError from 'http-errors';
import * as GemstoneRepository from './gemstones.repository.js';

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

const normalizeQuery = (query) => {
    const filteredQuery = {};
    if (query.name) filteredQuery.name = { $regex: query.name, $options: 'i' };
    if (query.zodiac) filteredQuery.zodiac = { $regex: query.zodiac, $options: 'i' };
    if (query.color) filteredQuery.color = { $regex: query.color, $options: 'i' };
    return filteredQuery;
};

const requireGemstone = async (gemstonePromise) => {
    const gemstone = await gemstonePromise;
    if (!gemstone) throw createError.NotFound('Gema no encontrada.');
    return gemstone;
};

/* -------------------------------------------------------------------------- */
/*                                 USE CASES                                  */
/* -------------------------------------------------------------------------- */

export const findGemstones = async ({ query }) => {
    return GemstoneRepository.findMany(normalizeQuery(query));
};

export const findGemstoneById = async ({ gemstoneId }) => {
    return requireGemstone(GemstoneRepository.findOne({ _id: gemstoneId }));
};

export const createGemstone = async ({ gemstoneData }) => {
    return GemstoneRepository.createOne(gemstoneData);
};

export const updateGemstoneById = async ({ gemstoneId, gemstoneUpdateData }) => {
    return requireGemstone(GemstoneRepository.updateOne({ _id: gemstoneId }, gemstoneUpdateData));
};

export const deleteGemstoneById = async ({ gemstoneId }) => {
    return requireGemstone(GemstoneRepository.deleteOne({ _id: gemstoneId }));
};
