import { z } from 'zod';

export const InviteAdminModalFormSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    firstName: z.string().min(1, { message: 'First name is required' }).refine((val) => val.trim() !== '', {
        message: 'First name is required',
    }),
    lastName: z.string().min(1, { message: 'Last name is required' }).refine((val) => val.trim() !== '', {
        message: 'Last name is required',
    }),
});

export type InviteAdminModalFormType = z.infer<typeof InviteAdminModalFormSchema>;
