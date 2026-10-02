import { create } from "zustand";
import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "https://api.hippocampus-academy.com/api";
// export const API_URL = "http://localhost:8000/api";
axios.defaults.withCredentials = true;

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
	failedQueue.forEach(prom => {
		if (error) {
			prom.reject(error);
		} else {
			prom.resolve(token);
		}
	});
	failedQueue = [];
};

axios.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== `${API_URL}/auth/login` && originalRequest.url !== `${API_URL}/auth/refresh`) {
			if (isRefreshing) {
				return new Promise(function(resolve, reject) {
					failedQueue.push({ resolve, reject });
				}).then(token => {
					return axios(originalRequest);
				}).catch(err => {
					return Promise.reject(err);
				});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				await axios.post(`${API_URL}/auth/refresh`);
				isRefreshing = false;
				processQueue(null);
				return axios(originalRequest);
			} catch (refreshError) {
				isRefreshing = false;
				processQueue(refreshError, null);
				
				// Automatically log out user if refresh fails completely
				useAuthStore.getState().logout();
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,
	signup: async (email, password, fullName, phoneNumber) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/auth/signup`, { email, password, fullName, phoneNumber });
			set({ user: response.data.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response.data.message || "Error signing up", isLoading: false });
			throw error;
		}
	},
	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/auth/login`, { email, password });
			set({
				isAuthenticated: true,
				user: response.data.data.user,
				error: null,
				isLoading: false,
			});
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},
	googleLogin: async (token) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/auth/google`, { token });
			set({
				isAuthenticated: true,
				user: response.data.data.user,
				error: null,
				isLoading: false,
			});
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in with Google", isLoading: false });
			throw error;
		}
	},
	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/auth/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });

		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},
	verifyEmail: async (email, verificationToken) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/auth/verify-email`, { email, verificationToken });
			set({ user: response.data.data.user, isAuthenticated: true, isLoading: false });
			return response.data;
		} catch (error) {
			set({ error: error.response?.data?.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},
	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/auth/check-auth`);
			set({ user: response.data.data.user, isAuthenticated: true, isCheckingAuth: false });
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	},
	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},
	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/auth/reset-password`, { token, password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},
}));


export const signup = async (...args) => useAuthStore.getState().signup(...args);
export const checkAuth = async () => useAuthStore.getState().checkAuth();

