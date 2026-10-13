import BoxOuterMaterial from '../../db-schemas/box-outer-material.schema.js';

export const createOne = async (data) => {
    return new BoxOuterMaterial(data).save();
};

export const updateOne = async (filter, update) => {
    return BoxOuterMaterial.findOneAndUpdate(filter, update, {
        new: true,
        runValidators: true,
    });
};

export const deleteOne = async (filter) => {
    return BoxOuterMaterial.findOneAndDelete(filter);
};
