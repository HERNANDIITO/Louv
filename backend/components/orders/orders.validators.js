import { z } from 'zod';
import ObjectId from '../../helpers/validators/object-id.validator.js';

export const CreateOrderSchema = z
    .object({
        products: z.array(ObjectId).nonempty(),
    })
    .strict();
