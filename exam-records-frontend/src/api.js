import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',  // Backend running on port 3000
});

export default api;
