import { z } from 'zod';
import LouvEnums from '../../db-schemas/enums.schema.js';
import ObjectId from '../../helpers/validators/object-id.validator.js';

export const JewelCreationSchema = z
    .object({
        name: z.string().trim().nonempty(),
        additionalTime: z.number().nonnegative().optional().default(0),
        timeSpent: z.number().nonnegative().default(0),
        snapshot: z.string().optional(),
        composition: z.object({
            baseStructure: ObjectId,
            size: ObjectId,
            material: ObjectId,
            materialPurity: ObjectId,
            profile: ObjectId.optional(),
            variant: ObjectId.optional(),
            settingsSize: z.array(z.enum(LouvEnums.SETTING_SIZES)),

            settings: z.array(
                z.object({
                    setting: ObjectId,
                    gemstone: ObjectId,
                    gemstoneCut: ObjectId.optional(),
                    isSynthetic: z.boolean().default(false),
                    clawNumber: ObjectId.optional(),
                    clawType: ObjectId.optional(),
                    pattern: z
                      .array(
                          z.object({
                              pattern: ObjectId, 
                              gemstone: z.array(ObjectId), 
                              isSynthetic: z.array(z.boolean()).default([]),
                          })
                      )
                      .optional()
                      .default([]),
                })
            ),
        }),

        box: ObjectId.optional(),
        boxInnerColor: ObjectId.optional(),
        boxOuterColor: ObjectId.optional(),
        boxDetailColor: ObjectId.optional(),
    })
    .strict();

export const JewelNameUpdateSchema = z.object({
    name: z.string().trim().min(1).max(50),
});
