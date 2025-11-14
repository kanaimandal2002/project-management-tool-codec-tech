import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  config.headers = { ...config.headers, ...getAuthHeader() };
  return config;
});

export const getProjectAnalytics = async (projectId) => {
  const response = await axiosInstance.get(`/analytics/project/${projectId}`);
  return response.data;
};
