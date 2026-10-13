import Cut from '../../db-schemas/cut.schema.js';

export const findMany = async (filter) => {
    return Cut.find(filter).lean();
};

export const findOne = async (filter) => {
    return Cut.findById(filter).lean();
};