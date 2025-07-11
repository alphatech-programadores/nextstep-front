import axios from 'axios';

// 1. Utiliza una variable de entorno para la URL base de la API
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api', // La base de todas tus rutas de la API
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});



// 2. Crea un "interceptor" de peticiones.
// Esta función se ejecutará ANTES de que cada petición sea enviada.
axiosInstance.interceptors.request.use(
    (config) => {
        // Obtenemos el token del localStorage
        const token = localStorage.getItem('access_token');

        // Si el token existe, lo añadimos a los encabezados de la petición
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // 👈 IMPORTANTE: Bearer + espacio        
        }

        return config; // Devolvemos la configuración modificada
    },
    (error) => {
        // Manejo de errores de la configuración de la petición
        return Promise.reject(error);
    }
);

export default axiosInstance;
