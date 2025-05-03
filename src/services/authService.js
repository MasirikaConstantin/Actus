// src/services/authService.js
import { SANCTUM_TOKEN_KEY } from "../config/apiConfig";

// Sauvegarder le token après connexion
export const setAuthToken = (token) => {
  localStorage.setItem(SANCTUM_TOKEN_KEY, token);
};

// Récupérer le token
export const getAuthToken = () => {
  return localStorage.getItem(SANCTUM_TOKEN_KEY);
};

// Vérifier si un token existe
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Supprimer le token (déconnexion)
export const removeAuthToken = () => {
  localStorage.removeItem(SANCTUM_TOKEN_KEY);
};