import mongoose from 'mongoose';
import { addressSchema } from './address.schema.js';
import louvEnums from './enums.schema.js';

const userSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        name: {
            type: String,
            required: true,
        },
        surname: {
            type: String,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
        },
        googleId: {
            type: String,
        },
        dni: {
            type: String,
        },
        title: {
            type: String,
            enum: louvEnums.TITLES,
            default: null,
        },
        countryPrefix: {
            type: String,
        },
        phone: {
            type: String,
        },
        registrationDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
        lastLogin: {
            type: Date,
            required: true,
            default: Date.now,
        },
        address: addressSchema,
    },
    { strict: true }
);

userSchema.index({ dni: 1 });

userSchema.index({ unique: true, partialFilterExpression: { dni: { $exists: true, $ne: null } } });

const User = mongoose.model('User', userSchema);

export default User;
