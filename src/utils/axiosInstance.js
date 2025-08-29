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

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // ✅ tu jo use karta ha wo daal
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // token localStorage me hona chahiye
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
 
export default instance; 

 