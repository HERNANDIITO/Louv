import Employee from '../../db-schemas/employee.schema.js';

export const findMany = async (filter = {}) => {
    return Employee.find(filter).lean();
};

export const findOne = async (filter) => {
    return Employee.findOne(filter).lean();
};

export const createOne = async (data) => {
    return new Employee(data).save();
};

export const updateOne = async (filter, update) => {
    return Employee.findOneAndUpdate(filter, update, {
        new: true,
        runValidators: true,
    });
};

export const deleteOne = async (filter) => {
    return Employee.findOneAndDelete(filter);
};
