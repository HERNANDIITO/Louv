import * as OrderService from './orders.service.js';

export const getOrders = async (req, res) => {
    const orders = await OrderService.findOrders({ query: req.query });
    res.status(200).json({ result: 'OK', orders });
};

export const getOrderById = async (req, res) => {
    const order = await OrderService.findOrderById({ orderId: req.params.orderId });
    res.status(200).json({ result: 'OK', order });
};

export const postOrder = async (req, res) => {
    const order = await OrderService.createOrder({ userId: req.session._id, orderData: req.body });
    res.status(201).json({ result: 'OK', order });
};

export const copyJewelIntoOrder = async (req, res) => {
    const order = await OrderService.copyJewelIntoOrder({
        userId: req.session._id,
        orderId: req.params.orderId,
        jewelId: req.params.jewelId,
    });
    res.status(200).json({ result: 'OK', order });
};

export const updateOrderById = async (req, res) => {
    const order = await OrderService.updateOrderById({
        orderId: req.params.orderId,
        orderUpdateData: req.body,
    });
    res.status(200).json({ result: 'OK', order });
};

export const deleteOrderById = async (req, res) => {
    await OrderService.deleteOrderById({ orderId: req.params.orderId });
    res.status(204).end();
};
