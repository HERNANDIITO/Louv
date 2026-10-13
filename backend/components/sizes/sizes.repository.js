import Size from '../../db-schemas/size.schema.js';

export const findMany = async () => {
    return Size.find().lean();
};

export const findOne = async (filter) => {
    return Size.findOne(filter).lean();
};