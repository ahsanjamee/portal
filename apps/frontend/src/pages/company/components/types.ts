import { z } from 'zod';

const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
const digitsRegex = /^\d+$/;

export const CreateCompanyFormSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    // subDomain: z.string().min(1, { message: 'Subdomain is required' }),
    authDomains: z.array(
        z.string().refine(
            (val) => domainRegex.test(val),
            (val) => ({ message: `${val} must be in format like abc.com` })
        )
    ).min(1, { message: 'At least one auth domain is required' }),
    userLimit: z.string().min(1, { message: 'User limit is required' }).refine(
        (value) => digitsRegex.test(value) && parseInt(value) >= 1,
        { message: 'User limit must be a number and at least 1' }
    ),
    firstName: z.string().trim().min(1, { message: 'First name is required' }),
    lastName: z.string().trim().min(1, { message: 'Last name is required' }),
    companyName: z.string().trim().min(1, { message: 'Company name is required' }),
    address: z.string().trim().min(1, { message: 'Address is required' }),
    phone: z.string()
        .min(10, { message: 'Phone number must be at least 10 digits' })
        .max(16, { message: 'Phone number must be at most 16 digits' })
        .refine(
            (value) => /^\d+$/.test(value),
            { message: 'Phone number must contain only digits' }
        ),
});

export const EditCompanyFormSchema = z.object({
    authDomains: z.array(
        z.string().refine(
            (val) => domainRegex.test(val),
            (val) => ({ message: `${val} must be in format like abc.com` })
        )
    ).min(1, { message: 'At least one auth domain is required' }),
    userLimit: z.string().min(1, { message: 'User limit is required' }).refine(
        (value) => digitsRegex.test(value) && parseInt(value) >= 1,
        { message: 'User limit must be a number and at least 1' }
    ),
    address: z.string().trim().min(1, { message: 'Address is required' }),
    phone: z.string()
        .min(10, { message: 'Phone number must be at least 10 digits' })
        .max(16, { message: 'Phone number must be at most 16 digits' })
        .refine(
            (value) => /^\d+$/.test(value),
            { message: 'Phone number must contain only digits' }
        ),
    companyName: z.string().trim().min(1, { message: 'Company name is required' }),
});

export type EditCompanyFormType = z.infer<typeof EditCompanyFormSchema>;

export type CreateCompanyFormType = z.infer<typeof CreateCompanyFormSchema>;
