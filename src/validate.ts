import zod from 'zod'
const validationRule = zod.object({
    username: zod.string().min(3).max(50),
    password: zod.string() 
      .min(5)
      .max(16)
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a number"),
});


export const validatation = validationRule;