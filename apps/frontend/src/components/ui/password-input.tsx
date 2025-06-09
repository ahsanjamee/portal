import * as React from 'react';

import { cn } from '@/lib/utils';
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	setShowPassword: () => void;
	showPassword: boolean;
	hasError?: boolean;
}

const InputPassword = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
	return (
		<div className="relative">
			<input
				type={type}
				className={cn(
					'flex h-[46px] w-full rounded border border-vadio-text-50 border-input bg-background p-3 pr-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-vadio-violet-300  placeholder:text-sm placeholder: font-normal   placeholder:leading-[22px] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
					className,
				)}
				ref={ref}
				{...props}
				autoComplete="off"
			/>
			<div className="absolute right-3 sm:top-4 top-[10px] cursor-pointer" onClick={props.setShowPassword}>
				{props.showPassword ? <RiEyeLine /> : <RiEyeOffLine />}
			</div>
		</div>
	);
});
InputPassword.displayName = 'InputPassword';

export { InputPassword };
