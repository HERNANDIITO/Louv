/*import { z } from 'zod';
import louvEnums from '../../db-schemas/enums.schema.js'; 


const objectIdRegex = /^[a-f\d]{24}$/i;

export const eventSchema = z.object({
    // Zod usará exactamente la misma lista que Mongoose
    eventType: z.enum(louvEnums.EVENT_TYPE), 
    
    userId: z.string().regex(objectIdRegex).nullable().optional(),
    anonymousId: z.string().nullable().optional(),
    metadata: z.record(z.unknown()).optional().default({})
});*/

//versión que sí que funciona:
import { z } from 'zod';

export const eventSchema = z.object({
    eventType: z.string(), 
    userId: z.any().optional(), 
    anonymousId: z.any().optional(),
    metadata: z.any().optional()
}); 