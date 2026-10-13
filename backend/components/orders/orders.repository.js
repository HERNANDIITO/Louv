import Order from '../../db-schemas/order.schema.js';
import User from '../../db-schemas/user.schema.js';
import BaseStructure from '../../db-schemas/base-structure.schema.js';
import Size from '../../db-schemas/size.schema.js';
import Material from '../../db-schemas/material.schema.js';
import Profile from '../../db-schemas/profile.schema.js';
import Setting from '../../db-schemas/setting.schema.js';
import Gemstone from '../../db-schemas/gemstone.schema.js';
import Cut from '../../db-schemas/cut.schema.js';
import Box from '../../db-schemas/box.schema.js';
import boxDetailMaterial from '../../db-schemas/box-detail-material.schema.js';
import boxInnerMaterial from '../../db-schemas/box-inner-material.schema.js';
import boxOuterMaterial from '../../db-schemas/box-outer-material.schema.js';

export const findMany = async ({ filter = {}, pagination = {}, sort = {}, username }) => {
    const orders = await Order.find(filter)
        .sort(sort)
        .skip(pagination.skip)
        .limit(pagination.limit)
        .populate([
            { path: 'user' },
            { path: 'products.composition.material', model: 'Material' },
            { path: 'products.composition.baseStructure', model: 'BaseStructure' },
            { path: 'products.composition.settings.gemstone', model: 'Gemstone' },
            { path: 'products.composition.settings.gemstoneCut', model: 'Cut' },
            { path: 'products.composition.size', model: 'Size' },
            { path: 'products.composition.profile', model: 'Profile' },
            { path: 'products.composition.settings.setting', model: 'Setting' },
        ])
        .lean();

    let filteredOrders = orders;

    if (username) {
        const regex = new RegExp(username, 'i');
        filteredOrders = orders.filter(
            (order) => order.user && regex.test(order.user.name)
        );
    }

    return {
        orders: filteredOrders,
        total: username ? filteredOrders.length : await Order.countDocuments(filter),
    };
};

export const findOne = (filter) => {
    return Order.findOne(filter).lean();
};

export const createOne = (data) => {
    return new Order(data).save();
};

export const updateOne = (filter, update) => {
    return Order.findOneAndUpdate(filter, update, {
        new: true,
        runValidators: true,
    });
};

export const deleteOne = (filter) => {
    return Order.findOneAndDelete(filter);
};
