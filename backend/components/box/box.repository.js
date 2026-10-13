import Box from '../../db-schemas/box.schema.js';
import boxInnerMaterial from '../../db-schemas/box-inner-material.schema.js';
import boxOuterMaterial from '../../db-schemas/box-outer-material.schema.js';
import boxDetailMaterial from '../../db-schemas/box-detail-material.schema.js';

export const findMany = async (filter = {}) => {
    return Box.find(filter).lean();
};

export const findManyInners = async (filter = {}) => {
    return boxInnerMaterial.find(filter).lean();
};

export const findManyOuters = async (filter = {}) => {
    return boxOuterMaterial.find(filter).lean();
};

export const findManyDetails = async (filter = {}) => {
    return boxDetailMaterial.find(filter).lean();
};

export const findCompatibleMaterials = async (filter, type) => {
    return Box.findOne(filter).select(type).populate(type).lean();
};

export const findOne = async (filter) => {
    return Box.findById(filter).lean();
};

export const createOne = async (data) => {
    return new Box(data).save();
};

export const updateOne = async (filter, update) => {
    return Box.findOneAndUpdate(filter, update, {
        new: true,
        runValidators: true,
    });
};

export const deleteOne = async (filter) => {
    return Box.findOneAndDelete(filter);
};
