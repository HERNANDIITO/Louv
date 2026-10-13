import mongoose from 'mongoose';
import { addressSchema } from './address.schema.js';
import { jewelrySchema } from './jewelry.schema.js';
import louvEnums from './enums.schema.js';

const orderSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        orderNumber: {
            type: String,
            required: true,
            unique: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        state: {
            type: String,
            enum: louvEnums.ORDER_STATES,
            required: true,
            default: 'ordered',
        },
        cartCreationDate: {
            // inCart
            type: Date,
            required: true,
            default: Date.now,
        },
        lastUpdate: {
            // para detectar carritos abandonados
            type: Date,
            required: true,
            default: Date.now,
        },
        deliveryDate: {
            // delivered
            type: Date,
        },
        invoiceId: {
            type: String, // id del programa de facturación
        },
        invoice: {
            type: String,
        },
        taxableTotalPrice: {
            // sin IVA
            type: mongoose.Schema.Types.Decimal128,
            required: true,
            default: 0.0,
        },
        totalPrice: {
            // con IVA 21%
            type: mongoose.Schema.Types.Decimal128,
            required: true,
            default: 0.0,
        },
        shippingPrice: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
            default: 0.0,
        },
        address: addressSchema,
        products: [
            {
                ...jewelrySchema.obj,
                dedication: {
                    type: String,
                },
            },
        ],
    },
    { strict: true }
);

const Order = mongoose.model('Order', orderSchema);

orderSchema.index({ user: 1, state: 1, lastUpdate: -1 });

export default Order;
