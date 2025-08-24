import axios from 'axios';

const API_URL = 'http://localhost:5197/api'; // ajuste para sua porta do backend

export const login = async (username, password) => {
  const res = await axios.post(`${API_URL}/auth/login`, { username, password });
  return res.data.token;
};

export const getProducts = async (token) => {
  const res = await axios.get(`${API_URL}/products`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const addProduct = async (token, product) => {
  const res = await axios.post(`${API_URL}/products`, product, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
