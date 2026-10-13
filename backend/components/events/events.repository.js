import Event from '../../db-schemas/event.schema.js';
import MonthlyStat from '../../db-schemas/monthly-stat.schema.js';

export const createEvent = async (eventData) => {
    const event = new Event(eventData);
    return await event.save(); 
};

export const incrementMonthlyStat = async (monthKey, fieldToIncrement) => {
    return await MonthlyStat.updateOne(
        { monthKey },
        { 
            $inc: { [fieldToIncrement]: 1 },
            $set: { lastUpdated: new Date() }
        },
        { upsert: true }
    );
};

export const findFirstOccurrence = async (userId, eventType) => {
    return await Event.findOne({ userId, eventType }).lean();
};