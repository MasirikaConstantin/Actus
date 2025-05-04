import axios from 'axios';

const api = axios.create({
    baseURL: 'https://actus.mascodeproduct.com/api',
    withCredentials: true, // Crucial pour Sanctum
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  });
  

export const login = async (credentials) => {
    try {
      // D'abord récupérer le cookie CSRF
      await api.get('/sanctum/csrf-cookie');
      
      // Ensuite faire la requête de login
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
      
      if (error.response) {
        // Erreur 404 signifie que la route n'existe pas
        if (error.response.status === 404) {
          throw { message: 'Endpoint de connexion introuvable. Vérifiez la configuration.' };
        }
        // Erreurs de validation (422)
        if (error.response.status === 422) {
          throw error.response.data.errors;
        }
        // Erreur d'authentification (401)
        if (error.response.status === 401) {
          throw { message: 'Email ou mot de passe incorrect' };
        }
      }
      
      throw { message: error.message || 'Une erreur est survenue lors de la connexion' };
    }
  };



export const register = async (userData) => {
    try {
      await api.get('/sanctum/csrf-cookie');
      
      const response = await api.post('/register', {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.passwordConfirmation,
        terms: true
      });
      
      if (response.data.token) {
        localStorage.setItem('sanctum_token', response.data.token);
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
      }
      
      throw new Error('Réponse inattendue du serveur');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      
      if (error.response) {
        if (error.response.status === 422) {
          throw error.response.data.errors;
        }
      }
      
      throw { message: 'Une erreur est survenue lors de l\'inscription' };
    }
  };
  
  export const logout = async () => {
    try {
      await api.post('/logout');
      localStorage.removeItem('sanctum_token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  };
export default api;