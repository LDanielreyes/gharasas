import axios from 'axios';

// Vite utiliza import.meta.env para las variables de entorno
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const client = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para manejar tokens expirados o inválidos
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Limpiar token y forzar redirección
            localStorage.removeItem('token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default client;
