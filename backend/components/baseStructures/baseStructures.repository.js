import BaseStructure from '../../db-schemas/base-structure.schema.js';
import Profile from '../../db-schemas/profile.schema.js';

export const findMany = async () => {
    return BaseStructure.find()
        .populate([
            {
                path: 'defaultDesign.material',
            },
            {
                path: 'defaultDesign.profile',
            },
            {
                path: 'profiles.profile',
            },
            {
                path: 'profiles.variants.settingsInfo',
            },
            {
                path: 'profiles.variants.modelBySize',
            },
        ])
        .lean();
};

export const findOne = async (filter) => {
    return BaseStructure.findOne(filter)
        .populate([
            {
                path: 'defaultDesign.material',
            },
            {
                path: 'defaultDesign.profile',
            },
            {
                path: 'profiles.profile',
            },
            {
                path: 'profiles.variants.settingsInfo',
            },
            {
                path: 'profiles.variants.modelBySize',
            },
        ])
        .lean();
};

export const createOne = async (data) => {
    return new BaseStructure(data).save();
};

export const deleteOne = async (filter) => {
    return BaseStructure.findOneAndDelete(filter);
};
