import axios from 'axios';

const apitoken = axios.create({
  baseURL: 'https://actus.mascodeproduct.com/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export const login = async (credentials) => {
  try {
    const response = await apitoken.post('/login', credentials);
    
    // Vérification de la structure de réponse attendue
    if (response.data && response.data.access_token) {
      localStorage.setItem('sanctum_token', response.data.access_token);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    }
    
    throw new Error('Réponse inattendue du serveur');
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    
    if (error.response) {
      // Erreur 401 - Non autorisé
      if (error.response.status === 401) {
        throw { message: 'Email ou mot de passe incorrect' };
      }
      // Erreurs de validation (422)
      if (error.response.status === 422) {
        throw error.response.data.errors;
      }
    }
    
    throw { 
      message: error.message || 'Erreur de connexion au serveur' 
    };
  }
};
export const register = async (userData) => {
  try {
    const response = await apitoken.post('/register', {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      password_confirmation: userData.passwordConfirmation,
      terms: true
    });

    // Modification ici pour vérifier access_token au lieu de token
    if (response.data && response.data.access_token) {
      localStorage.setItem('sanctum_token', response.data.access_token);
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    }

    throw new Error('Réponse inattendue du serveur');
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);

    if (error.response) {
      // Erreurs de validation (422)
      if (error.response.status === 422) {
        throw {
          message: 'Validation failed',
          errors: error.response.data.errors
        };
      }
      // Erreur de conflit (compte existant)
      if (error.response.status === 409) {
        throw { message: 'Un compte existe déjà avec cet email' };
      }
    }

    throw { 
      message: error.message || 'Erreur lors de la création du compte' 
    };
  }
};

export const logout = async () => {
  try {
    // Ajout du token dans le header pour la déconnexion
    const token = localStorage.getItem('sanctum_token');
    const response = await apitoken.post('/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    localStorage.removeItem('sanctum_token');
    localStorage.removeItem('user');
    
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);

    // Même en cas d'erreur, on nettoie le local storage
    localStorage.removeItem('sanctum_token');
    localStorage.removeItem('user');

    if (error.response) {
      // Non autorisé (token invalide/expiré)
      if (error.response.status === 401) {
        throw { message: 'Session déjà expirée' };
      }
    }

    throw { 
      message: error.message || 'Erreur lors de la déconnexion' 
    };
  }
};
export default apitoken;