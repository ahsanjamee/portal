import { notifications } from '@mantine/notifications';
import { UseMutationOptions, UseQueryOptions, useMutation, useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

export type SuccessResponse<T> = {
	success: true;
	data: T;
	message: null;
};

export type FailedResponse = {
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
		notifications.show({
			message: res.data.message,
			color: 'red',
		});
		throw new ApiError(res.data.message);
	} catch (error) {
		if (fallback) {
			return fallback;
		}

		if (error instanceof ApiError) {
			throw error;
		}

		console.log(error);
		throw new ApiError('Network_error');
	}
};

export const processAPIClientResponse = async <T>(promise: Promise<BaseResponse<T>>) => {
	try {
		const res = await promise;

		if (res.success) {
			return res.data;
		}

		throw new ApiError(res.message);
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}

		console.log(error);
		throw new ApiError('Network_error');
	}
};

export type QueryOptions<T> = Omit<UseQueryOptions<T>, 'queryFn'>;
export type MutationOptions<T> = Pick<UseMutationOptions<T>, 'onError' | 'onSuccess' | 'onSettled' | 'onMutate'>;

export const makeQuery = <Response, Args extends readonly any[]>(
	fn: (...args: Args) => Promise<BaseResponse<Response>>,
	key: (string | number)[],
) => {
	type WithOptions = [...Args, options?: QueryOptions<Response>];
	return (...args: WithOptions) => {
		const argsLength = args.length - 1;
		const options = args.length === argsLength ? {} : args[argsLength];
		return useQuery({
			queryKey: key,
			queryFn: () => processAPIClientResponse(fn(...(args as any))),
			...options,
		});
	};
};

export const makeMutation = <Response, Variables>(fn: (data: Variables) => Promise<BaseResponse<Response>>) => {
	return (options?: MutationOptions<Response>) => {
		return useMutation<Response, unknown, Variables>({
			mutationFn: (data) => processAPIClientResponse(fn(data)),
			...(options as any),
		});
	};
};
