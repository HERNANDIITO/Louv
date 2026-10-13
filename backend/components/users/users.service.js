import createError from 'http-errors';
import bcrypt from 'bcrypt';
import * as UserRepository from './users.repository.js';

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

const ensureEmailIsAvailable = async (email) => {
    if (!email?.trim()) return;
    const existing = await UserRepository.findOne({ email });
    if (existing) throw createError.Conflict('El email ya está en uso.');
};

const normalizeUserData = async (userData) => {
    const data = { ...userData };
    if (data.password) data.password = await hashPassword(data.password);
    return data;
};

const requireUser = async (userPromise) => {
    const user = await userPromise;
    if (!user) throw createError.NotFound('Usuario no encontrado.');
    return user;
};

/* -------------------------------------------------------------------------- */
/*                         INTERNAL / SHARED FUNCTIONS                        */
/* -------------------------------------------------------------------------- */

export const findUserByEmail = async ({ userEmail }) => {
    return requireUser(UserRepository.findOne({ email: userEmail }));
};

export const findUserByGoogleId = async ({ userGoogleId }) => {
    return requireUser(UserRepository.findOne({ googleId: userGoogleId }));
};

export const createUser = async ({ userData }) => {
    await ensureEmailIsAvailable(userData.email);
    const data = await normalizeUserData(userData);
    return UserRepository.createOne(data);
};

/* -------------------------------------------------------------------------- */
/*                                 USE CASES                                  */
/* -------------------------------------------------------------------------- */

export const findUsers = async () => {
    return UserRepository.findMany();
};

export const findUserById = async ({ userId }) => {
    return requireUser(UserRepository.findOne({ _id: userId }));
};

export const updateUserById = async ({ userId, userUpdateData }) => {
    if (userUpdateData.email) {
        // Buscamos si hay un usuario con ese email
        const existingUser = await UserRepository.findOne({
            email: userUpdateData.email,
        });

        // Si existe un usuario con ese email y NO es el mismo que está actualizando, lanzamos error
        if (existingUser && existingUser._id.toString() !== userId.toString()) {
            throw createError.Conflict('El email ya está en uso');
        }
    }

    // Normalizamos los datos y actualizamos
    const data = await normalizeUserData(userUpdateData);
    return requireUser(UserRepository.updateOne({ _id: userId }, data));
};

export const deleteUserById = async ({ userId }) => {
    return requireUser(UserRepository.deleteOne({ _id: userId }));
};
