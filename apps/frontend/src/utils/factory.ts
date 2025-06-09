import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosInstance, AxiosResponse } from 'axios';

import { useAuthAxios, usePublicAxios } from '@/lib/http/axios.hook';
import { BaseResponse, processResponse } from './api';

type QueryOptions<T> = Omit<UseQueryOptions<T>, 'queryKey'> & {
    queryKey?: string[];
};

type MutationOptions<T> = UseMutationOptions<T>;

export const makeAuthQuery = <Response, Params extends readonly any[]>(
    fn: (axios: AxiosInstance, ...args: Params) => Promise<AxiosResponse<Response>>,
    key: string[],
) => {
    type WithOptions = [...Params, options?: QueryOptions<Response>];

    return function GeneratedUseQueryHook(...args: WithOptions) {
        const argLength = fn.length - 1;
        const options = argLength === args.length ? {} : (args.pop() as QueryOptions<Response> | undefined) || {};

        const axios = useAuthAxios();
        return useQuery({
            queryKey: key,
            queryFn: () =>
                processResponse(
                    () => fn(axios, ...(args as unknown as Params)) as Promise<AxiosResponse<BaseResponse<Response>>>,
                ),
            ...options,
        });
    };
};
export const makeAuthMutation = <Response, Variables>(
    fn: (axios: AxiosInstance, data: Variables) => Promise<AxiosResponse<Response>>,
) => {
    return function GeneratedUseMutationHook(options?: MutationOptions<Response>) {
        const axios = useAuthAxios();
        return useMutation<Response, unknown, Variables>({
            mutationFn: (data) =>
                processResponse(() => fn(axios, data) as Promise<AxiosResponse<BaseResponse<Response>>>),
            ...(options as any),
        });
    };
};

export const makePublicAuthMutation = <Response, Variables>(
    fn: (axios: AxiosInstance, data: Variables) => Promise<AxiosResponse<Response>>,
) => {
    return function GeneratedUseMutationHook(options?: MutationOptions<Response>) {
        const axios = usePublicAxios();
        return useMutation<Response, unknown, Variables>({
            mutationFn: (data) =>
                processResponse(() => fn(axios, data) as Promise<AxiosResponse<BaseResponse<Response>>>),
            ...(options as any),
        });
    };
};
