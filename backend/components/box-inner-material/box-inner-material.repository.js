import BoxInnerMaterial from '../../db-schemas/box-inner-material.schema.js';

export const createOne = async (data) => {
    return new BoxInnerMaterial(data).save();
};

export const updateOne = async (filter, update) => {
    return BoxInnerMaterial.findOneAndUpdate(filter, update, {
        new: true,
        runValidators: true,
    });
};

export const deleteOne = async (filter) => {
    return BoxInnerMaterial.findOneAndDelete(filter);
};
