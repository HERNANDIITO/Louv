import mongoose from 'mongoose';
import louvEnums from './enums.schema.js';

const eventSchema = new mongoose.Schema(
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            auto: true,
        },
        eventType: {
            type: String,
            required: true,
            enum: louvEnums.EVENT_TYPE,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
            default: null, 
        },
        anonymousId: {
            type: String, 
        },
        metadata: {
            type: Object, 
            default: {},
        },
        createdAt: {
            type: Date,
            default: Date.now,
        }
    },
    { strict: true }
);

eventSchema.index({ createdAt: 1 });
eventSchema.index({ eventType: 1, createdAt: 1 });

const Event = mongoose.model('Event', eventSchema);

export default Event;