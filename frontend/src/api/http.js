import axios from 'axios';


const apiRequest = axios.create();

apiRequest.interceptors.request.use((config) => {
   config.url = import.meta.env.VITE_API_URL + config.url;
    return config;
}, error => {
    return Promise.reject(error);
});

export {
    apiRequest
}