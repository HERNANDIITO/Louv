import * as EventsRepository from './events.repository.js';

export const registerEvent = async (data) => {
   
    const { eventType, userId, anonymousId, metadata } = data;
    const monthKey = new Date().toISOString().slice(0, 7); // "2026-05"
   
    const newEvent = await EventsRepository.createEvent({
        eventType,
        userId,
        anonymousId,
        metadata
    });
   
    const fieldMap = {
        'page_view': 'visits',
        'active_session': 'activeUsers',
        'login': 'logins',
        'signup': 'signups',
        'editor_access': 'editorAccesses',
        'return_visit': 'returningUsers'
    };

    const fieldToIncrement = fieldMap[eventType];

    if (fieldToIncrement) {
        await EventsRepository.incrementMonthlyStat(monthKey, fieldToIncrement);

        if (eventType === 'return_visit') {
            await EventsRepository.incrementMonthlyStat(monthKey, 'visits');
        }
    }

    if ((eventType === 'page_view' || eventType === 'return_visit') && metadata?.source) {
        const sourceField = `sources.${metadata.source}`;
       
        await EventsRepository.incrementMonthlyStat(monthKey, sourceField);
    }

    if (eventType === 'login' && userId) {
        const previousEvent = await EventsRepository.findFirstOccurrence(userId, 'login');

        if (previousEvent && previousEvent._id.toString() !== newEvent._id.toString()) {
            
            const alreadyCountedThisMonth = await EventsRepository.findFirstOccurrence(userId, 'return_visit');

            if (!alreadyCountedThisMonth) {
                const monthKey = new Date().toISOString().slice(0, 7);
                await EventsRepository.incrementMonthlyStat(monthKey, 'returningUsers');
                
                await EventsRepository.createEvent({
                    eventType: 'return_visit',
                    userId,
                    metadata: { reason: 'recurring_login' }
                });
            }
        }
    }
    
    return newEvent;
};