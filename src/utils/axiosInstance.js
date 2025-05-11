import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

export default axiosInstance;