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



// Fonction pour récupérer les posts du carousel
export const getCarouselPosts = async () => {
  try {
    const response = await api.get('/caroussel');
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des posts du carousel:', error);
    throw error;
  }
};


// Fonction pour rechercher des posts
export const searchPosts = async (query) => {
  try {
    const response = await api.get('/search', {
      params: {
        query: query
      }
    });
    console.log(response.data.posts);
    return response.data.posts;
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    throw error;
  }
};
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

export const getPostById = async (id) => {
  try {
    const response = await api.get(`/posts/${id}`);
    return response.data; // retourne les données du post
  } catch (error) {
    console.error('Erreur lors de la récupération du post :', error);
    throw error;
  }
};


export const getAllPostsByCategory = async (slug) => {
  try {
    const response = await api.get(`/category/${slug}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des posts par catégorie:', error);
    throw error;
  }
};

export const getCategorie = async (categorie) => {
  try {
    const response = await api.get(`/categories/${categorie}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des posts par catégorie:', error);
    throw error;
  }
};

export const getPostsByCategory = async (id) => {
  try {
    const response = await api.get(`/posts/${id}`);
    return response.data; // retourne les données du post
  } catch (error) {
    console.error('Erreur lors de la récupération du post :', error);
    throw error;
  }
};

export const getPostBySlug = async (slug) => {
  const response = await api.get(`/posts/slug/${slug}`);
  return response.data;
};




export const checkAuth = () => {
  const token = localStorage.getItem('sanctum_token');
  return !!token;
};



export const login = async (credentials) => {
  try {
    // Récupération du cookie CSRF
    await api.get('/sanctum/csrf-cookie');
    
    const response = await api.post('/login', credentials);
    
    if (response.data.token) {
      localStorage.setItem('sanctum_token', response.data.token);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    }
    
    throw new Error('Réponse inattendue du serveur');
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    
    // Gestion des erreurs spécifiques
    if (error.response) {
      // Erreurs de validation (422)
      if (error.response.status === 422) {
        throw error.response.data.errors;
      }
      // Erreur d'authentification (401)
      if (error.response.status === 401) {
        throw { message: 'Email ou mot de passe incorrect' };
      }
    }
    
    throw { message: 'Une erreur est survenue lors de la connexion' };
  }
};

export default api;