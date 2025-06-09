import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	hasError?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
	return (
		<input
			type={type}
			className={cn(
				'flex sm:h-[46px] h-9 w-full rounded border border-vadio-text-50 border-input bg-background p-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-vadio-violet-300  placeholder:text-sm placeholder: font-normal   placeholder:leading-[22px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
				className,
				`${props.hasError && 'border-red-500'}`,
			)}
			ref={ref}
			{...props}
			autoComplete="off"
		/>
	);
});
Input.displayName = 'Input';

export { Input };
