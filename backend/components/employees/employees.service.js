import createError from 'http-errors';
import bcrypt from 'bcrypt';
import * as EmployeeRepository from './employees.repository.js';

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

const normalizeEmployeeData = async (employeeData) => {
    const data = { ...employeeData };
    if (data.password) data.password = await hashPassword(data.password);
    return data;
};

const requireEmployee = async (employeePromise) => {
    const employee = await employeePromise;
    if (!employee) throw createError.NotFound('Empleado no encontrado.');
    return employee;
};

const verifyPassword = async (plain, hashed) => {
    return hashed ? await bcrypt.compare(plain, hashed) : false;
};

/* -------------------------------------------------------------------------- */
/*                        INTERNAL / SHARED FUNCTIONS                         */
/* -------------------------------------------------------------------------- */

export const findEmployeeByEmail = async ({ employeeEmail }) => {
    return requireEmployee(EmployeeRepository.findOne({ email: employeeEmail }));
};

export const updateEmployeePasswordById = async ({ employeeId, employeeUpdateData }) => {
    const existingEmployee = await findEmployeeById({ employeeId });
    if (
        !existingEmployee ||
        !(await verifyPassword(
            employeeUpdateData.currentPassword,
            existingEmployee.password
        ))
    ) {
        throw createError.BadRequest('Contraseña incorrecta');
    }

    const { newPassword } = employeeUpdateData;
    return updateEmployeeById({
        employeeId,
        employeeUpdateData: { password: newPassword },
    });
};

/* -------------------------------------------------------------------------- */
/*                                 USE CASES                                  */
/* -------------------------------------------------------------------------- */

export const findEmployees = async () => {
    return EmployeeRepository.findMany();
};

export const findEmployeeById = async ({ employeeId }) => {
    return requireEmployee(EmployeeRepository.findOne({ _id: employeeId }));
};

export const createEmployee = async ({ employeeData }) => {
    return requireEmployee(EmployeeRepository.createOne(employeeData));
};

export const updateEmployeeById = async ({ employeeId, employeeUpdateData }) => {
    const data = await normalizeEmployeeData(employeeUpdateData);
    return requireEmployee(EmployeeRepository.updateOne({ _id: employeeId }, data));
};

export const deleteEmployeeById = async ({ employeeId }) => {
    return requireEmployee(EmployeeRepository.deleteOne({ _id: employeeId }));
};
