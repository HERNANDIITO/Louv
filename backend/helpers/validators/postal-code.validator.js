import { z } from 'zod';

const PostalCode = z
    .string()
    .trim()
    .transform((val) => val.replace(/\s/g, ''))
    .refine((val) => /^(0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/.test(val));

export default PostalCode;
