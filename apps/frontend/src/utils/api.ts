import { AxiosResponse } from 'axios';

type SuccessResponse<T> = {
	success: true;
	data: T;
	message: null;
};

type FailedResponse = {
	success: false;
	message: string;
};

export type BaseResponse<T> = SuccessResponse<T> | FailedResponse;

class ApiError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'ApiError';
	}
}

export const processResponse = async <T>(fn: () => Promise<AxiosResponse<BaseResponse<T>>>, fallback?: T) => {
	try {
		const res = await fn();

		if (res.data.success) {
			return res.data.data;
		}

		throw new ApiError(res.data.message);
	} catch (error) {
		if (fallback) {
			return fallback;
		}

		if (error instanceof ApiError) {
			throw error;
		}

		throw new ApiError('Network_error');
	}
};
