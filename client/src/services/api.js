import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5000`
});

export default API;
