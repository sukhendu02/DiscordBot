import axiosInstance from './axiosInstance';

export const fetchRules = async (serverId) => {
  const response = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/api/v1/rules`, {
    params: { serverId },
  });
  return response.data;
};

export const createRule = async (serverId, rule) => {
  const response = await axiosInstance.post(`${import.meta.env.VITE_API_URL}/api/v1/rules`, { serverId, ...rule });
  return response.data;
};

export const updateRule = async (id, updates) => {
  const response = await axiosInstance.patch(`${import.meta.env.VITE_API_URL}/api/v1/rules/${id}`, updates);
  return response.data;
};

export const deleteRule = async (id) => {
  await axiosInstance.delete(`${import.meta.env.VITE_API_URL}/api/v1/rules/${id}`);
};
