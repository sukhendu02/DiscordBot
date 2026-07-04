import axiosInstance from './axiosInstance';

export const login = async (email, password) => {
  const response = await axiosInstance.post(`${import.meta.env.VITE_API_URL}/api/v1/auth/login`, { email, password });
  return response.data;
};

export const fetchCurrentAdmin = async () => {
  const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/api/v1/auth/me`);
  return response.data;
};
