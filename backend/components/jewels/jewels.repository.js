import Jewel from '../../db-schemas/jewelry.schema.js';

export const findMany = (filter) => {
    return Jewel.find(filter).lean();
};

export const findOne = (filter) => {
    return Jewel.findOne(filter).lean();
};

export const createOne = (data) => {
    return new Jewel(data).save();
};

export const updateOne = (filter, update) => {
    return Jewel.findOneAndUpdate(filter, update, {
        new: true,
        runValidators: true,
    });
};

export const deleteOne = (filter) => {
    return Jewel.findOneAndDelete(filter);
};
