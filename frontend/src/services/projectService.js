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

export const createProject = async (data) => {
  const response = await axiosInstance.post('/projects', data);
  return response.data;
};

export const getProjects = async () => {
  const response = await axiosInstance.get('/projects');
  return response.data;
};

export const getProjectById = async (id) => {
  const response = await axiosInstance.get(`/projects/${id}`);
  return response.data;
};

export const updateProject = async (id, data) => {
  const response = await axiosInstance.put(`/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id) => {
  const response = await axiosInstance.delete(`/projects/${id}`);
  return response.data;
};
