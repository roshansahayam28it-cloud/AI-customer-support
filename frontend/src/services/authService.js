import axios from "axios";

const API = "http://127.0.0.1:8000/auth";

export const registerUser = (data) => {
  return axios.post(`${API}/register`, data);
};

export const loginUser = (data) => {
  return axios.post(`${API}/login`, data);
};