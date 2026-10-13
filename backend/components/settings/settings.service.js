import createError from 'http-errors';
import * as SettingRepository from './settings.repository.js';

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

const filterQuery = (query) => {
    const filteredQuery = {};
    if (query.name) filteredQuery.name = { $regex: query.name, $options: 'i' };
    return filteredQuery;
};

const requireSetting = async (settingPromise) => {
    const setting = await settingPromise;
    if (!setting) throw createError.NotFound('Engaste no encontrado.');
    return setting;
};

/* -------------------------------------------------------------------------- */
/*                                 USE CASES                                  */
/* -------------------------------------------------------------------------- */

export const findSettings = async ({ query }) => {
    return SettingRepository.findMany(filterQuery(query));
};

export const findSettingById = async ({ settingId }) => {
    return requireSetting(SettingRepository.findOne({ _id: settingId }));
};

export const createSetting = async ({ settingData }) => {
    return SettingRepository.createOne(settingData);
};

export const updateSettingById = async ({ settingId, settingUpdateData }) => {
    return requireSetting(SettingRepository.updateOne({ _id: settingId }, settingUpdateData));
};

export const deleteSettingById = async ({ settingId }) => {
    return requireSetting(SettingRepository.deleteOne({ _id: settingId }));
};
