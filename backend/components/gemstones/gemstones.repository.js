import Gemstone from '../../db-schemas/gemstone.schema.js';

export const findMany = async (query = {}) => {
    return Gemstone.find(query).lean();
};

export const findOne = async (filter) => {
    return Gemstone.findOne(filter).lean();
};

export const createOne = async (data) => {
    return new Gemstone(data).save();
};

export const updateOne = async (filter, update) => {
    return Gemstone.findOneAndUpdate(filter, update, {
        new: true,
        runValidators: true,
    });
};

export const deleteOne = async (filter) => {
    return Gemstone.findOneAndDelete(filter);
};
