import { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const ProfilePhotoEditor = ({ onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userData, setUserData] = useState(null);
  const fileInputRef = useRef(null);

  // Récupérer les données utilisateur depuis localStorage au montage
  useEffect(() => {
    const userDataFromStorage = localStorage.getItem('user');
    const tokenFromStorage = localStorage.getItem('sanctum_token');
    
    if (userDataFromStorage) {
      try {
        const parsedUser = JSON.parse(userDataFromStorage);
        setUserData(parsedUser);
      } catch (error) {
        console.error("Erreur lors du parsing des données utilisateur:", error);
      }
    }
  }, []);

  // Fonction pour rafraîchir les données utilisateur
  const fetchUserData = async () => {
    if (!userData?.id) return;
    
    try {
      const token = localStorage.getItem('sanctum_token');
      const response = await axios.get(
        `https://actus.mascodeproduct.com/api/user/${userData.id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        }
      );
      
      const updatedUser = response.data.data;
      setUserData(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      if (onUpdate) onUpdate(updatedUser);
      
      return updatedUser;
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem('sanctum_token');
        localStorage.removeItem('user');
        window.location.reload();
      }
      return null;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
      setSuccess(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Veuillez sélectionner une photo');
      return;
    }
    if (!userData?.id) {
      setError('Utilisateur non identifié');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('id', userData.id);

      const token = localStorage.getItem('sanctum_token');
      
      // 1. Envoyer la nouvelle photo
      await axios.post(
        'https://actus.mascodeproduct.com/api/user/update-photo', 
        formData, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json'
          },
          withCredentials: true
        }
      );

      // 2. Rafraîchir les données
      const updatedUser = await fetchUserData();
      
      if (!updatedUser) {
        throw new Error('Échec de la mise à jour');
      }

      setSuccess('Photo de profil mise à jour avec succès!');
      
      setTimeout(() => {
        setIsModalOpen(false);
        setSelectedFile(null);
        setPreview('');
        setSuccess(null);
      }, 1500);

    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.error || 
                      'Une erreur est survenue';
      setError(errorMsg);
      
      if (err.response?.status === 401) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Affichage de la photo actuelle */}
      <div className="avatar mb-4">
        <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          {userData?.image ? (
            <img 
              src={userData.image} 
              alt="Photo de profil"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://ui-avatars.com/api/?name=${userData?.name || ''}&background=random`;
              }}
            />
          ) : (
            <div className="bg-gray-200 w-full h-full flex items-center justify-center">
              <span className="text-gray-500">Pas de photo</span>
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={() => setIsModalOpen(true)}
        className="btn btn-outline btn-sm"
      >
        Changer la photo
      </button>

      <dialog open={isModalOpen} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Modifier la photo de profil</h3>
          
          {preview ? (
            <div className="flex justify-center mb-4">
              <img src={preview} alt="Preview" className="max-w-xs rounded-lg" />
            </div>
          ) : (
            <div className="flex justify-center items-center bg-gray-100 rounded-lg mb-4" style={{ height: '200px' }}>
              <p className="text-gray-500">Aucune image sélectionnée</p>
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div className="flex justify-between mb-4">
            <button 
              onClick={() => fileInputRef.current.click()}
              className="btn btn-outline"
            >
              {selectedFile ? 'Changer' : 'Sélectionner'}
            </button>
            
            {selectedFile && (
              <button 
                onClick={() => {
                  setSelectedFile(null);
                  setPreview('');
                }}
                className="btn btn-ghost"
              >
                Supprimer
              </button>
            )}
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{success}</span>
            </div>
          )}

          <div className="modal-action">
            <button 
              onClick={() => {
                setIsModalOpen(false);
                setSelectedFile(null);
                setPreview('');
                setError(null);
                setSuccess(null);
              }}
              className="btn btn-ghost"
            >
              Annuler
            </button>
            <button 
              onClick={handleSubmit}
              className="btn btn-primary"
              disabled={!selectedFile || isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : 'Enregistrer'}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ProfilePhotoEditor;