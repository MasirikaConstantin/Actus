import { useState, useEffect } from 'react';
import apitoken from '../services/apiConfig';
import ProfilePhotoEditor from './ProfilePhotoEditor';

const ProfileEditor = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [formData, setFormData] = useState({
    id:user.id,
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    password_confirmation: '',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!user) {
    return <div>Veuillez vous connecter</div>;
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const token = user?.access_token; // ou user?.access_token selon ta structure
      const response = await apitoken.put('/user', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });      setUser(response.data.user);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setMessage('Profil mis à jour avec succès.');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="card bg-base-100 shadow-xl">
        <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
        <div className="card bg-base-200 shadow-lg p-6">
          <ProfilePhotoEditor user={user} onUpdate={setUser} />

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block font-semibold mb-1">Nom</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Mot de passe</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input input-bordered w-full"
                placeholder="Laisser vide pour ne pas changer"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Confirmation mot de passe</label>
              <input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            {message && <p className="text-green-600">{message}</p>}
            {error && <p className="text-red-600">{error}</p>}

            <button type="submit" className="btn btn-primary w-full">
              Mettre à jour
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;
