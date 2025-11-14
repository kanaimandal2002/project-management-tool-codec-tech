import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export const register = async (name, email, password) => {
  const response = await axiosInstance.post('/auth/register', { name, email, password });
  return response.data;
};

export const login = async (email, password) => {
  const response = await axiosInstance.post('/auth/login', { email, password });
  return response.data;
};

export const getCurrentUser = async (token) => {
  const response = await axiosInstance.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
