import { Oval } from 'react-loader-spinner';

export const ButtonLoader = () => {
	return (
		<div className="h-full flex items-center justify-center">
			<Oval
				height={20}
				width={20}
				color="#ffff"
				visible={true}
				ariaLabel="oval-loading"
				secondaryColor="#ffff"
				strokeWidth={4}
				strokeWidthSecondary={4}
			/>
		</div>
	);
};
