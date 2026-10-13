import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import createError from 'http-errors';

import * as UserService from '../users.service.js';
import * as JewelService from '../../jewels/jewels.service.js';
import * as OrderService from '../../orders/orders.service.js';

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

const verifyPassword = async (plain, hashed) => {
    return hashed ? await bcrypt.compare(plain, hashed) : false;
};

/* -------------------------------------------------------------------------- */
/*                         INTERNAL / SHARED FUNCTIONS                        */
/* -------------------------------------------------------------------------- */

export const updateUserPasswordById = async ({ userId, userUpdateData }) => {
    const existingUser = await UserService.findUserById({ userId });

    if (
        !existingUser ||
        !(await verifyPassword(userUpdateData.currentPassword, existingUser.password))
    ) {
        throw createError.BadRequest('Contraseña incorrecta');
    }

    const { newPassword } = userUpdateData;
    return UserService.updateUserById({
        userId,
        userUpdateData: { password: newPassword },
    });
};

/* -------------------------------------------------------------------------- */
/*                                 USE CASES                                  */
/* -------------------------------------------------------------------------- */

export const findJewels = async ({ userId }) => {
    return JewelService.findOwnedJewels({ userId });
};

export const findJewelById = async ({ userId, jewelId }) => {
    return JewelService.findOwnedJewelById({ jewelId, userId });
};

export const findOrders = async ({ userId }) => {
    return OrderService.findOwnedOrders({ userId });
};

export const findOrderById = async ({ userId, orderId }) => {
    return OrderService.findOwnedOrderById({ orderId, userId });
};

export const deleteUserById = async ({ userId, userDeleteData }) => {
    const account = await UserService.findUserById({ userId });
    const password = userDeleteData.currentPassword;

    if (!account || !(await verifyPassword(password, account.password))) {
        throw createError.BadRequest('Contraseña incorrecta');
    }

    return UserService.deleteUserById({ userId });
};

export const createJewel = async ({ userId, jewelData }) => {
    return JewelService.createJewel({ userId, jewelData });
};

export const updateUserById = async ({ userId, userUpdateData }) => {
    return UserService.updateUserById({ userId, userUpdateData });
};

export const updateJewelById = async ({ userId, jewelId, jewelUpdateData }) => {
    return JewelService.updateOwnJewelById({ userId, jewelId, jewelUpdateData });
};

export const updateJewelNameById = async ({ userId, jewelId, jewelUpdateData }) => {
    return JewelService.updateOwnJewelById({ userId, jewelId, jewelUpdateData });
};

export const updateJewelShareHashWithPriceById = async ({ userId, jewelId }) => {
    const existingJewel = await JewelService.findOwnedJewelById({ jewelId, userId });
    const timesHashRenewed = existingJewel ? existingJewel.timesHashRenewed + 1 : 1;
    const shareHashWithPrice = crypto.randomBytes(32).toString('hex');
    await JewelService.updateOwnJewelById({
        jewelId,
        userId,
        jewelUpdateData: { shareHashWithPrice, timesHashRenewed },
    });
    return shareHashWithPrice;
};

export const updateJewelShareHasheWithoutPriceById = async ({ userId, jewelId }) => {
    const shareHashWithoutPrice = crypto.randomBytes(32).toString('hex');
    const existingJewel = await JewelService.findOwnedJewelById({ jewelId, userId });
    const timesHashRenewed = existingJewel ? existingJewel.timesHashRenewed + 1 : 1;
    await JewelService.updateOwnJewelById({
        jewelId,
        userId,
        jewelUpdateData: { shareHashWithoutPrice, timesHashRenewed },
    });
    return shareHashWithoutPrice;
};

export const deleteJewelById = async ({ userId, jewelId }) => {
    return JewelService.deleteOwnJewelById({ userId, jewelId });
};

export const deleteOrderById = async ({ userId, orderId }) => {
    return OrderService.deleteOwnedOrderById({ userId, orderId });
};
