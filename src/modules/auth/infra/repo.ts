import { axiosInstance } from '../../../core/api/axios';

export const authRepo = {
	login: (email: string, password: string) =>
		axiosInstance.post('/auth/login', { email, password }).then((res) => res.data),
	me: () => axiosInstance.get('/auth/me').then((res) => res.data),
	logout: () => axiosInstance.post('/auth/logout').then((res) => res.data),
	refresh: () => axiosInstance.post('/auth/refresh').then((res) => res.data)
};
