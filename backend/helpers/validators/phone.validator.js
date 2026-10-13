import { z } from 'zod';

const Phone = z
    .string()
    .trim()
    .transform((val) => val.replace(/[\s-]/g, ''))
    .refine((val) => /^(\+34)?[6789]\d{8}$/.test(val));

export default Phone;
