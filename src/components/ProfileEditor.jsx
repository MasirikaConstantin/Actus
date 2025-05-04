import { useState, useEffect } from 'react';
import apitoken from '../services/apiConfig';
import ProfilePhotoEditor from './ProfilePhotoEditor';

const ProfileEditor = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  if (!user) {
    return <div>Veuillez vous connecter</div>;
  }

  const handleUserUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  

  if (!user) return <div className="text-center">Chargement...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="card bg-base-100 shadow-xl">
      <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
      <div className="card bg-base-200 shadow-lg p-6 ">
        <ProfilePhotoEditor user={user} onUpdate={handleUserUpdate} />
        
        <div className="mt-6">
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;