import { z } from 'zod';
import LouvEnums from '../../../db-schemas/enums.schema.js';
import Password from '../../../helpers/validators/password.validator.js';
import Phone from '../../../helpers/validators/phone.validator.js';
import PostalCode from '../../../helpers/validators/postal-code.validator.js';

export const DeleteAccountSchema = z.object({
    password: Password,
});

export const UpdateAccountSchema = z
    .object({
        name: z.string().trim().nonempty(),
        surname: z.string().trim().nonempty().optional().nullable(),
        email: z.email(),
        dni: z.string().trim().optional().nullable(),
        title: z.enum(LouvEnums.TITLES).nullable().optional().default(null),
        phone: Phone.optional().nullable(),
        address: z
            .object({
                street: z.string().trim().nonempty(),
                extraInfo: z.string().trim().optional(),
                postalCode: PostalCode,
                locality: z.string().trim().nonempty(),
                province: z.enum(LouvEnums.SPAIN_PROVINCES),
                country: z.enum(LouvEnums.COUNTRIES),
            })
            .optional()
            .nullable(),
    })
    .strict();

export const UpdateAccountPasswordSchema = z
    .object({
        currentPassword: Password,
        newPassword: Password,
        confirmNewPassword: Password,
    })
    .strict()
    .refine((data) => data.newPassword === data.confirmNewPassword);
