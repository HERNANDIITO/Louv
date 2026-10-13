import { z } from 'zod';

import LouvEnums from '../../db-schemas/enums.schema.js';
import Password from '../../helpers/validators/password.validator.js';
import Phone from '../../helpers/validators/phone.validator.js';

export const RegisterSchema = z
    .object({
        name: z.string().trim().nonempty(),
        surname: z.string().trim().nonempty().optional(),
        password: Password,
        repassword: Password,
        email: z.email(),
        title: z.enum(LouvEnums.TITLES).optional().default(null),
        phone: z.preprocess((val) => (val === '' ? undefined : val), Phone.optional()),
        acceptTerms: z.literal(true),
    })
    .strict()
    .refine((data) => {
        return data.password === data.repassword;
    });

export const LoginSchema = z
    .object({
        email: z.email(),
        password: Password,
        rememberMe: z.boolean(),
    })
    .strict();

export const TotpConfirmSchema = z
    .object({
        totpCode: z.string().trim().nonempty().length(6),
    })
    .strict();

export const TotpVerifySchema = z
    .object({
        email: z.email(),
        totpCode: z.string().trim().nonempty().length(6),
    })
    .strict();
