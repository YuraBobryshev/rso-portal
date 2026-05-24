import api from '../api/axiosConfig'

// Создаем экземпляр с базовым URL
const api = axios.create({
  baseURL: '/api', // ВСЕ запросы автоматически получат этот префикс
});

// Настраиваем передачу токена (чтобы не писать headers в каждом файле)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;