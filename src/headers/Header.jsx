import { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', darkMode ? 'light' : 'dark');
  };

  return (
    <>
      {/* Header Principal */}
      <header className="navbar bg-base-200 shadow-lg sticky top-0 z-50 rounded-2xl">
        <div className="navbar-start">
          {/* Menu Mobile (Drawer) */}
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><Link to="/">Accueil</Link></li>
              <li><Link to="/actualites">Actualités</Link></li>
              <li><Link to="/categories">Catégories</Link></li>
              <li><Link to="/tous">Tout les Posts</Link></li>
              <li><Link to="/abonnements">Abonnements</Link></li>
            </ul>
          </div>

          {/* Logo */}
          <Link to="/" className="btn btn-ghost normal-case text-xl">
            <span className="text-primary">Mascode</span>Actualités
          </Link>
        </div>

        {/* Navigation Desktop */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 space-x-2">
            <li><Link to="/" className="hover:text-primary">Accueil</Link></li>
            <li><Link to="/actualites" className="hover:text-primary">Actualités</Link></li>
            <li><Link to="/categories" className="hover:text-primary">Catégories</Link></li>
            <li><Link to="/tous" className="hover:text-primary">Tous</Link></li>
            {/*<li><Link to="/abonnements" className="hover:text-primary">Abonnements Premium</Link></li>*/}
          </ul>
        </div>

        {/* Boutons Header Droite */}
        <div className="navbar-end space-x-2">
          {/* Barre de Recherche Intelligente */}
          <div className="hidden md:flex">
            <div className="join">
              <input
                type="text"
                placeholder="Rechercher..."
                className="input input-bordered join-item w-40 md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="btn btn-primary join-item">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Bouton Dark Mode */}
          <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          {/* Bouton Connexion */}
          <button onClick={() => setLoginModalOpen(true)} className="btn btn-primary">
            Connexion
          </button>
        </div>
      </header>

      {/* Modal de Connexion Avancé */}
      <dialog open={loginModalOpen} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Connexion à votre compte</h3>
          
          <div className="tabs tabs-boxed my-4">
            <a className="tab tab-active">Connexion</a> 
            <a className="tab">Inscription</a>
            <a className="tab">Mot de passe oublié</a>
          </div>

          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input type="email" placeholder="votre@email.com" className="input input-bordered" />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Mot de passe</span>
              </label>
              <input type="password" placeholder="••••••••" className="input input-bordered" />
            </div>

            <div className="flex items-center justify-between">
              <label className="label cursor-pointer">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className="label-text ml-2">Se souvenir de moi</span> 
              </label>
              
              <a href="#" className="text-sm link link-hover">Aide?</a>
            </div>
          </div>

          <div className="modal-action">
            <button onClick={() => setLoginModalOpen(false)} className="btn btn-ghost">Annuler</button>
            <button className="btn btn-primary">Se connecter</button>
          </div>
        </div>
        
        {/* Fermer en cliquant à l'extérieur */}
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setLoginModalOpen(false)}>close</button>
        </form>
      </dialog>

      {/* Notification Toast (exemple) */}
      <div className="toast toast-top toast-end hidden">
        <div className="alert alert-info">
          <span>Nouveaux articles disponibles!</span>
        </div>
      </div>
    </>
  );
};

export default Header;