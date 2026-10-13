import BoxDetailMaterial from '../../db-schemas/box-detail-material.schema.js';

export const createOne = async (data) => {
    return new BoxDetailMaterial(data).save();
};

export const updateOne = async (filter, update) => {
    return BoxDetailMaterial.findOneAndUpdate(filter, update, {
        new: true,
        runValidators: true,
    });
};

export const deleteOne = async (filter) => {
    return BoxDetailMaterial.findOneAndDelete(filter);
};
