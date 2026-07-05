import axiosInstance from './axiosInstance';

export const fetchDashboardSummary = async () => {
  const { data } = await axiosInstance.get(`${import.meta.env.VITE_API_URL}/api/v1/dashboard/summary`);
  return data;
};