import createError from 'http-errors';
import crypto from 'crypto';

import * as OrderRepository from './orders.repository.js';
import * as JewelService from '../jewels/jewels.service.js';
import * as UserService from '../users/users.service.js';
import Decimal from 'decimal.js';

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

const normalizeQuery = (query) => {
    const filter = {};

    if (query.fromDate || query.toDate) {
        filter.cartCreationDate = {};
        if (query.fromDate) filter.cartCreationDate.$gte = new Date(query.fromDate);
        if (query.toDate) filter.cartCreationDate.$lte = new Date(query.toDate);
    }
    
    if (query.status) filter.state = query.status;

    if (query.minTotal || query.maxTotal) {
        filter.totalPrice = {};
        if (query.minTotal) filter.totalPrice.$gte = parseFloat(query.minTotal);
        if (query.maxTotal) filter.totalPrice.$lte = parseFloat(query.maxTotal);
    }

    const page = parseInt(query.page) > 0 ? parseInt(query.page) : 1;
    const limit = parseInt(query.limit) > 0 ? parseInt(query.limit) : 20;
    const skip = (page - 1) * limit;

    let sortField = query.sort || 'cartCreationDate';
    const sortOrder = query.order === 'desc' ? -1 : 1;

    const validSortFields = [
        'cartCreationDate',
        'lastUpdate',
        'totalPrice',
        'user',
        'state',
        'deliveryDate',
    ];
    if (!validSortFields.includes(sortField)) sortField = 'cartCreationDate';

    return {
        filter,
        pagination: { skip, limit },
        sort: { [sortField]: sortOrder },
        username: query.username,
    };
};

const calculatePrices = (products) => {
    const taxableTotalPrice = products.reduce(
        (sum, p) => sum.plus(p.taxablePrice.toString()),
        new Decimal(0)
    );

    const subtotal = products.reduce(
        (sum, p) => sum.plus(p.currentPrice.toString()),
        new Decimal(0)
    );

    const shippingPrice = subtotal.greaterThan(500) ? new Decimal(0) : new Decimal(5);

    return {
        taxableTotalPrice,
        totalPrice: subtotal.plus(shippingPrice),
        shippingPrice,
    };
};

const normalizeOrderData = async ({ products, resolver }) => {
    const resolvedProducts = await Promise.all(products.map((p) => resolver(p)));
    const prices = calculatePrices(resolvedProducts);

    return {
        products: resolvedProducts,
        ...prices,
    };
};

const requireOrder = async (orderPromise) => {
    const order = await orderPromise;
    if (!order) throw createError.NotFound('Pedido no encontrado.');
    return order;
};

/* -------------------------------------------------------------------------- */
/*                        INTERNAL / SHARED FUNCTIONS                         */
/* -------------------------------------------------------------------------- */

export const findOwnedOrders = async ({ userId, orderId }) => {
    return requireOrder(OrderRepository.findMany({  filter: { user: userId }}));
};

export const findOwnedOrderById = async ({ userId, orderId }) => {
    return requireOrder(OrderRepository.findOne({ _id: orderId, user: userId }));
};

export const updateOwnedOrderById = async ({ userId, orderId, orderUpdateData }) => {
    const normalizedData = await normalizeOrderData({
        products: orderUpdateData.products,
        resolver: (id) => JewelService.findOwnedJewelById({ userId, jewelId: id }),
    });
    normalizedData.lastUpdate = new Date();
    return requireOrder(OrderRepository.updateOne({ _id: orderId }, normalizedData));
};

export const deleteOwnedOrderById = async ({ userId, orderId }) => {
    return requireOrder(OrderRepository.deleteOne({ _id: orderId, user: userId }));
};

/* -------------------------------------------------------------------------- */
/*                                 USE CASES                                  */
/* -------------------------------------------------------------------------- */

export const findOrders = async ({ query }) => {
    const queryData = normalizeQuery(query);
    return OrderRepository.findMany({
        filter: queryData.filter,
        pagination: queryData.pagination,
        sort: queryData.sort,
        username: queryData.username,
    });
};

export const findOrderById = async ({ orderId }) => {
    return requireOrder(OrderRepository.findOne({ _id: orderId }));
};

export const createOrder = async ({ userId, orderData }) => {
    const { _id, address } = await UserService.findUserById({ userId });

    const orderNumber = `ORD-${new Date().toISOString().slice(0, 10)}-${crypto.randomUUID().slice(0, 6)}`;

    const normalizedData = await normalizeOrderData({
        products: orderData.products,
        resolver: (id) => JewelService.findOwnedJewelById({ userId, jewelId: id }),
    });

    normalizedData.user = _id;
    normalizedData.address = address;
    normalizedData.orderNumber = orderNumber;

    return OrderRepository.createOne(normalizedData);
};

export const updateOrderById = async ({ orderId, orderUpdateData }) => {
    return requireOrder(OrderRepository.updateOne({ _id: orderId }, orderUpdateData));
};

export const copyJewelIntoOrder = async ({ userId, orderId, jewelId }) => {
    const order = await findOwnedOrderById({ userId, orderId });
    const products = [...order.products, jewelId];

    return updateOwnedOrderById({
        userId,
        orderId,
        orderUpdateData: { products },
    });
};

export const deleteOrderById = async ({ orderId }) => {
    return requireOrder(OrderRepository.deleteOne({ _id: orderId }));
};
