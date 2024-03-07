import z from 'zod'
export const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().regex(
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
        "Invalid mail",
    ),
    password: z.string(),
    picture: z.string().nullish(),
    access_level: z.enum(['USER', 'ADMIN']),
    createdAt: z.date(),
    deletedAt: z.date().nullish()
})

export const userRegisterSchema = userSchema.omit({ id: true, access_level: true, createdAt: true, deletedAt: true })

