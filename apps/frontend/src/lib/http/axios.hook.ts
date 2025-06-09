import { useGlobalStore } from '@/stores/global.store';
import axios from 'axios';
import qs from 'qs';
import { useMemo } from 'react';
import { LoginResponse } from '../entities/login.entity';

const isJWTExpired = (token: string) => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const jwt = JSON.parse(atob(token.split('.')[1]!));

		return Date.now() + 10_000 >= jwt.exp * 1000;
	} catch (error) {
		return true;
	}
};

export const createAuthAxios = ({
	getAccessToken,
	getRefreshToken,
	setAccessToken,
	onLogout,
	baseURL = import.meta.env.VITE_API_URL,
	normalizeArrayQuery = false,
}: {
	getAccessToken: () => string;
	getRefreshToken: () => string;

	setAccessToken: (token: string) => void;
	onLogout: () => void;
	baseURL?: string;
	normalizeArrayQuery?: boolean;
}) => {
	const instance = axios.create({
		baseURL,
		validateStatus: () => true,
		paramsSerializer: normalizeArrayQuery
			? (params) => {
				return qs.stringify(params, { arrayFormat: 'repeat' });
			}
			: undefined,
	});

	instance.interceptors.request.use(async (config) => {
		const accessToken = getAccessToken();

		if (!accessToken) {
			throw new Error('Not_authenticated');
		}

		const isAccessTokenExpired = isJWTExpired(accessToken);

		if (!isAccessTokenExpired) {
			config.headers.Authorization = `Bearer ${accessToken}`;

			return config;
		}

		const refreshToken = getRefreshToken();

		if (!refreshToken) {
			onLogout();
			return config;
		}

		const isRefreshTokenExpired = isJWTExpired(refreshToken);

		if (isRefreshTokenExpired) {
			onLogout();
			return config;
		}

		try {
			const { data } = await axios.post<LoginResponse>('/auth/refresh', {
				refreshToken: refreshToken,
			});

			config.headers.Authorization = `Bearer ${data.accessToken}`;

			setAccessToken(data.accessToken);
		} catch (error) {
			console.error(error);

			onLogout();
			return config;
		}

		return config;
	});

	instance.interceptors.response.use((response) => {
		if (response.status === 401) {
			onLogout();
		}

		return response;
	});

	return instance;
};

export const useAuthAxios = () => {
	const { store } = useGlobalStore();

	const axiosInstance = useMemo(() => {
		const instance = createAuthAxios({
			getAccessToken: () => store.getState().accessToken,
			getRefreshToken: () => store.getState().refreshToken,
			onLogout: () => store.onLogout(),
			setAccessToken: (token) => store.setAccessToken(token),
		});

		return instance;
	}, [store]);

	return axiosInstance;
};

export const usePublicAxios = () => {
	const instance = axios.create({
		baseURL: import.meta.env.VITE_API_URL,
		validateStatus: () => true,
	});

	return instance;
};
