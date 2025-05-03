import axios from 'axios';

// URL de base de l'API corrigée
const API_URL = import.meta.env.VITE_API_URL || 'https://actus.mascodeproduct.com/api';

// Création d'une instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Intercepteur pour ajouter le token Sanctum à chaque requête
api.interceptors.request.use(config => {
  const token = localStorage.getItem('sanctum_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Fonction pour récupérer les posts
export const getPosts = async (page = 1) => {
  try {
    const response = await api.get(`/posts?page=${page}`);
    return response.data; // Retourne tout l'objet de réponse avec la structure complète
  } catch (error) {
    console.error('Erreur lors de la récupération des posts:', error);
    throw error;
  }
};

// Reste du code inchangé...
export const login = async (credentials) => {
  try {
    // Si votre API utilise le CSRF
    await api.get('/sanctum/csrf-cookie');
    
    const response = await api.post('/login', credentials);
    if (response.data.token) {
      localStorage.setItem('sanctum_token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};

export const checkAuth = () => {
  const token = localStorage.getItem('sanctum_token');
  return !!token;
};

export const logout = async () => {
  try {
    await api.post('/logout');
    localStorage.removeItem('sanctum_token');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    // Supprimer le token même en cas d'erreur
    localStorage.removeItem('sanctum_token');
    throw error;
  }
};

export default api;