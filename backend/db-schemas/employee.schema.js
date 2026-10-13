import mongoose from 'mongoose';
import louvEnums from './enums.schema.js';

const employeeSchema = new mongoose.Schema(
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
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        permissions: {
            type: [String],
            enum: louvEnums.ROLES,
            default: ['admin'],
        },
        totp: {
            enabled: {
                type: Boolean,
                default: false,
            },
            secret: {
                type: String,
                required: false,
            },
            lastSetup: {
                type: Date,
                required: false,
            },
        },
    },
    { strict: true }
);
const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
