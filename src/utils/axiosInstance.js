//import axios from 'axios';
//const instance = axios.create({
  //baseURL: 'http://localhost:5000/api',
 
//});
//instance.interceptors.request.use((config) => {
  //const token = localStorage.getItem('token');
 // if (token) config.headers.Authorization = `Bearer ${token}`;
  //return config;
//});

//export default instance;

// utils/axiosInstance.js
import axios from 'axios';

// Local dev: '/api' is forwarded to localhost:5000 by the CRA proxy.
// Production on a separate host (e.g. Vercel): set REACT_APP_API_URL to the backend,
// e.g. https://skillswap-co6l.onrender.com/api
const instance = axios.create({
  baseURL: (process.env.REACT_APP_API_URL || '/api').replace(/\/+$/, ''),
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
