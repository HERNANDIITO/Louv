import * as EventsService from './events.service.js';

export const track = async (req, res) => {
    try {
        const event = await EventsService.registerEvent(req.body);
        res.status(201).json({ result: 'OK', event });
    } catch (error) {
        res.status(500).json({ result: 'ERROR', message: error.message });
    }
};