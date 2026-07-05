import axiosInstance from './axiosInstance';

export const fetchCommands = async (params = {}) => {
  const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/api/v1/commands`, { params });
  return response.data;
};

export const fetchCommandStats = async () => {
  const response = await axiosInstance.get('/api/commands/stats');
  return response.data;
};
