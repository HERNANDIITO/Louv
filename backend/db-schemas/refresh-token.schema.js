import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
        },
        tokenHash: {
            type: String,
            required: true,
        },
        userAgent: {
            type: String,
            required: true,
        },
        rememberMe: {
            type: Boolean,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { strict: true }
);

// Para usuarios normales
refreshTokenSchema.index(
    { user: 1, userAgent: 1 },
    {
        unique: true,
        partialFilterExpression: {
            user: { $type: 'objectId' },
        },
    }
);

// Para employees
refreshTokenSchema.index(
    { employee: 1, userAgent: 1 },
    {
        unique: true,
        partialFilterExpression: {
            employee: { $type: 'objectId' },
        },
    }
);

// Borrado automático si expiresAt es anterior a la fecha actual.
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);

export default RefreshToken;
