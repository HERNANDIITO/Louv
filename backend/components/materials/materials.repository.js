import Material from '../../db-schemas/material.schema.js';

export const findMany = async () => {
    return Material.find().lean();
};

export const findOne = async (filter) => {
    return Material.findOne(filter).lean();
};

export const createOne = async (data) => {
    return new Material(data).save();
};

export const updateOne = async (filter, update) => {
    return Material.findOneAndUpdate(filter, update, {
        new: true,
        runValidators: true,
    });
};

export const deleteOne = async (filter) => {
    return Material.findOneAndDelete(filter);
};
