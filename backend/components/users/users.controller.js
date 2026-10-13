import * as UserService from './users.service.js';

export const getUsers = async (req, res) => {
    const users = await UserService.findUsers({});
    res.status(200).json({ result: 'OK', users });
};

export const getUserById = async (req, res) => {
    const user = await UserService.findUserById({
        userId: req.params.userId,
    });

    res.status(200).json({ result: 'OK', user });
};

export const updateUserById = async (req, res) => {
    const user = await UserService.updateUserById({
        userId: req.params.userId,
        updateData: req.body,
    });

    res.status(200).json({ result: 'OK', user });
};

export const deleteUserById = async (req, res) => {
    await UserService.deleteUserById({
        userId: req.params.userId,
    });

    res.status(204).end();
};
