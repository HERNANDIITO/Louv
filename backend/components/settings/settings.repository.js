import Setting from '../../db-schemas/setting.schema.js';

export const findMany = async (query = {}) => {
    return Setting.find(query).lean();
};

export const findOne = async (filter) => {
    return Setting.findOne(filter).lean();
};

export const createOne = async (data) => {
    return new Setting(data).save();
};

export const updateOne = async (filter, update) => {
    return Setting.findOneAndUpdate(filter, update, {
        new: true,
        runValidators: true,
    });
};

export const deleteOne = async (filter) => {
    return Setting.findOneAndDelete(filter);
};
