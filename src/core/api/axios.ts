import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { env } from '../config/env';
import { getSession, setSession, clearSession, tryRefresh } from '../auth/session';

export const axiosInstance = axios.create({
	baseURL: env.API_BASE_URL,
	withCredentials: false
});

type CustomError = {
	message: string;
	status?: number;
	details?: any;
};

function isAxiosError(error: unknown): error is AxiosError {
	return (error as AxiosError).isAxiosError === true;
}

export default (config: AxiosRequestConfig) => {
	const s = getSession();
	if (s?.tokens?.accessToken) {
		config.headers = config.headers || {};
		config.headers.Authorization = `Bearer ${s.tokens.accessToken}`;
	}

	let isRefreshing = false;
	let queue: Array<() => void> = [];

	axios.interceptors.response.use(
		(res: AxiosResponse) => res,
		async (err: unknown) => {
			let original: any;
			let status: number | undefined;

			if (isAxiosError(err)) {
				original = err.config;
				status = err.response?.status;
			}

			if (status === 401 && original && !original._retry) {
				original._retry = true;
				if (!isRefreshing) {
					isRefreshing = true;
					try {
						const newTokens = await tryRefresh();
						setSession(newTokens);
						queue.forEach((resume) => resume());
						queue = [];
						return axios(original);
					} catch {
						clearSession();
					} finally {
						isRefreshing = false;
					}
				}
				return new Promise((resolve) => {
					queue.push(() => resolve(axios(original)));
				});
			}

			// Normalización de errores:
			const customError: CustomError = {
				message: isAxiosError(err)
					? err.response?.data?.message ?? err.message
					: (err as Error)?.message ?? 'Unknown error',
				status,
				details: isAxiosError(err) ? err.response?.data ?? null : null
			};
			return Promise.reject(new Error(JSON.stringify(customError)));
		}
	);
};
