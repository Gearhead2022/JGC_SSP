
import z from "zod";

export const PensionerSchema = z.object({
    legacyPensionerId: z.number().min(1,"id is required"),
    lastName: z.string().min(1,"lastname is required"),
    firstName: z.string().min(0,"firstname is required"),
    actualPension: z.number().min(0,"actual pension is required"),
    contingencyDate: z.string().min(1,"contingency date is required").date("invalid date"),
    bankName: z.string().min(1,"bank name is required"),
    birthDate: z.string().min(1,"birth day is required").date("invalid birth date"),
})


export type PensionerSchemaType = z.infer<typeof PensionerSchema>

export const updatePensionerSchema = PensionerSchema.extend({
    id: z.number()
})


export type UpdatePensionerSchemaType = z.infer<typeof updatePensionerSchema>

