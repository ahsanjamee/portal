/* eslint-disable @typescript-eslint/no-unused-vars */
import { z } from 'zod';

export const loginValidationSchema = () =>
	z.object({
		email: z
			.string()
			.min(1, { message: 'Email is required' })
			.email({ message: 'Must be a valid email' }),
		password: z
			.string()
			.trim()
			.min(8, { message: 'Password must be min 8 characters' }),
	});

export type LoginValidationType = z.infer<ReturnType<typeof loginValidationSchema>>;
