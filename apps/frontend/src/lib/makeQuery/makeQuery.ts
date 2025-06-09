import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';

type QueryOptions<T> = Omit<UseQueryOptions<T>, 'queryKey'> & {
	queryKey?: string | unknown[];
};

type MutationOptions<T> = UseMutationOptions<T>;

export const makeQuery = <Response, Params extends readonly any[]>(
	fn: (...args: Params) => Promise<Response>,
	key: string | unknown[],
) => {
	type WithOptions = [...Params, options?: QueryOptions<Response> & { onSuccess?: (data: Response) => void }];

	return (...args: WithOptions) => {
		const argLength = fn.length - 1;
		const options = argLength === args.length ? {} : (args.pop() as QueryOptions<Response> | undefined) || {};

		return useQuery<Response>({
			queryKey: key,
			queryFn: () =>
				fn(...(args as any)).then((res) => {
					(options as any).onSuccess?.(res);
					return res;
				}),
			...(options as any),
		});
	};
};

export const makeMutation = <Response, Variables>(
	fn: (data: Variables) => Promise<Response>,
	afterMutationSuccess?: (mutationData: Variables) => void,
) => {
	return (options?: MutationOptions<Response>) => {
		return useMutation<Response, unknown, Variables>({
			mutationFn: (data) =>
				fn(data).then((res) => {
					afterMutationSuccess?.(data);
					return res;
				}),
			...(options as any),
		});
	};
};
