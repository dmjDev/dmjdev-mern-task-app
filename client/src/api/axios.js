import axios from "axios";

const instance = axios.create({
    baseURL: 'http://127.0.0.1:4000/api',
    withCredentials: true
})

// Interceptor para ver la URL completa antes de enviar la petición
instance.interceptors.request.use((config) => {
    // Combinamos la baseURL con la url relativa de la petición
    const fullURL = `${config.baseURL}${config.url}`;

    // console.log('🚀 Petición enviada a:', fullURL);

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default instance
