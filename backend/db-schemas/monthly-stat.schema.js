import mongoose from 'mongoose';

const monthlyStatSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        monthKey: { // Formato "YYYY-MM" (ej: "2026-05")
            type: String,
            required: true,
            unique: true,
        },
        visits: { type: Number, default: 0 },
        activeUsers: { type: Number, default: 0 }, 
        logins: { type: Number, default: 0 },
        signups: { type: Number, default: 0 },
        editorAccesses: { type: Number, default: 0 },
        returningUsers: { type: Number, default: 0 },
        sources: {
        google: { type: Number, default: 0 },
        instagram: { type: Number, default: 0 },
        tiktok: { type: Number, default: 0 },
        facebook: { type: Number, default: 0 },
        wordpress: { type: Number, default: 0 },
        direct: { type: Number, default: 0 } 
        },
        lastUpdated: { type: Date, default: Date.now }
    },
    { strict: true }
);

const MonthlyStat = mongoose.model('MonthlyStat', monthlyStatSchema);

export default MonthlyStat;