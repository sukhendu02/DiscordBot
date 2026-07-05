import axiosInstance from './axiosInstance';

export const fetchServers = async () => {
  const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/api/v1/server`);
  return response.data;
};

export const createServer = async (server) => {
  const response = await axiosInstance.post(`${import.meta.env.VITE_API_URL}/api/v1/server`, server);
  return response.data;
};

export const updateServer = async (id, updates) => {
  const response = await axiosInstance.patch(`${import.meta.env.VITE_API_URL}/api/v1/server/${id}`, updates);
  return response.data;
};

export const deleteServer = async (id) => {
  await axiosInstance.delete(`${import.meta.env.VITE_API_URL}/api/v1/server/${id}`);
};
