import { notifications } from '@mantine/notifications';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const handleMutationError = (error: unknown) => {
	notifications.show({
		title: 'Error',
		message: (error as Error).message,
		color: 'red',
	});
};