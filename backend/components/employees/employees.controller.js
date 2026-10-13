import * as EmployeeService from './employees.service.js';

export const getEmployees = async (req, res) => {
    const employees = await EmployeeService.findEmployees({});
    res.status(200).json({ result: 'OK', employees });
};

export const getEmployeeById = async (req, res) => {
    const employee = await EmployeeService.findEmployeeById({
        employeeId: req.params.employeeId,
    });

    res.status(200).json({ result: 'OK', employee });
};

export const postEmployee = async (req, res) => {
    const employee = await EmployeeService.createEmployee({
        employeeData: req.body,
    });

    res.status(201).json({ result: 'OK', employee });
};

export const updateEmployeeById = async (req, res) => {
    const employee = await EmployeeService.updateEmployeeById({
        employeeId: req.params.employeeId,
        updateData: req.body,
    });

    res.status(200).json({ result: 'OK', employee });
};

export const deleteEmployeeById = async (req, res) => {
    await EmployeeService.deleteEmployeeById({
        employeeId: req.params.employeeId,
    });

    res.status(204).end();
};
