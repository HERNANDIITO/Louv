import User from "../../db-schemas/user.schema.js";

export const findMany = async (filter = {}) => {
    return User.find(filter).lean();
};

export const findOne = async (filter) => {
    return User.findOne(filter).lean();
};

export const createOne = async (data) => {
    return new User(data).save();
};

export const updateOne = async (filter, update) => {
    return User.findOneAndUpdate(filter, update, {
        new: true,
        runValidators: true,
    });
};

export const deleteOne = async (filter) => {
    return User.findOneAndDelete(filter);
};
