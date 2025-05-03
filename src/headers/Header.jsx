import { useState, useEffect,useCallback } from 'react';
import { Link } from 'react-router-dom';
import { searchPosts } from '../services/api';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Charger le thème
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'noire' : 'claire');
    setDarkMode(savedTheme === 'noire');
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Basculer le thème
  const toggleTheme = () => {
    const newTheme = darkMode ? 'claire' : 'noire';
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };
// Fonction de recherche avec debounce
const debouncedSearch = useCallback(() => {
  const handler = setTimeout(async () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      try {
        const results = await searchPosts(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error("Erreur de recherche:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
    }
  }, 300); // Délai de 300ms

  return () => {
    clearTimeout(handler);
  };
}, [searchQuery]);

useEffect(() => {
  debouncedSearch();
}, [searchQuery, debouncedSearch]);

// Gérer le changement de recherche
const handleSearchChange = (e) => {
  setSearchQuery(e.target.value);
};

// Effet pour fermer le modal avec la touche Escape
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setSearchModalOpen(false);
    }
  };

  if (searchModalOpen) {
    window.addEventListener('keydown', handleKeyDown);
  }

  return () => {
    window.removeEventListener('keydown', handleKeyDown);
  };
}, [searchModalOpen]);

  return (
    <>
      {/* Header Principal */}
      <header className="navbar bg-base-200 shadow-lg sticky top-0 z-50 px-0 sm:px-4 rounded-none sm:rounded-box">
                <div className="navbar-start w-full sm:w-auto">
          {/* Menu Mobile (Drawer) */}
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden px-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </label>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><Link to="/" className="active:bg-primary/20">Accueil</Link></li>
              <li><Link to="/actualites" className="active:bg-primary/20">Actualités</Link></li>
              <li><Link to="/categories" className="active:bg-primary/20">Catégories</Link></li>
              <li><Link to="/tous" className="active:bg-primary/20">Tous les Posts</Link></li>
              <li><Link to="/abonnements" className="active:bg-primary/20">Abonnements</Link></li>
            </ul>
          </div>

          {/* Logo - Centré en mobile */}
          <Link to="/" className="btn btn-ghost normal-case text-xl px-2 mx-auto sm:mx-0">
            <span className="text-primary">Mascode</span>Actualités
          </Link>
        </div>

        {/* Navigation Desktop */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-1">
            <li><Link to="/" className="hover:bg-primary/10 hover:text-primary rounded-btn">Accueil</Link></li>
            <li><Link to="/actualites" className="hover:bg-primary/10 hover:text-primary rounded-btn">Actualités</Link></li>
            <li><Link to="/categories" className="hover:bg-primary/10 hover:text-primary rounded-btn">Catégories</Link></li>
            <li><Link to="/tous" className="hover:bg-primary/10 hover:text-primary rounded-btn">Tous</Link></li>
          </ul>
        </div>

        {/* Boutons Header Droite */}
        <div className="navbar-end gap-1 sm:gap-2">
          {/* Bouton Recherche Mobile */}
          <button 
            className="btn btn-ghost btn-circle sm:hidden"
            onClick={() => setSearchModalOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Barre de Recherche Desktop */}
          <div className="hidden md:flex">
          <div className="join">
            <input
              type="text"
              placeholder="Rechercher..."
              className="input input-bordered join-item w-40 md:w-64"
              onClick={() => setSearchModalOpen(true)}
              readOnly
            />
            <button 
              className="btn btn-primary join-item"
              onClick={() => setSearchModalOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>


          {/* Bouton Dark Mode */}
          <button 
            onClick={toggleTheme} 
            className="btn btn-ghost btn-circle"
            aria-label={darkMode ? "Désactiver le mode sombre" : "Activer le mode sombre"}
          >
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
          <button 
            onClick={() => setLoginModalOpen(true)} 
            className="btn btn-primary btn-sm sm:btn-md"
          >
            <span className="hidden sm:inline">Connexion</span>
            <span className="sm:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
          </button>
        </div>
      </header>

      {/* Modal de Recherche Avancée */}
      {searchModalOpen && (
         <dialog id="searchModal" className={`modal ${searchModalOpen ? 'modal-open' : ''}`}>
         <div className="modal-box w-11/12 max-w-3xl relative">
           <button 
             onClick={() => setSearchModalOpen(false)} 
             className="btn btn-sm btn-circle absolute right-2 top-2"
           >
             ✕
           </button>
           
           <h3 className="font-bold text-2xl mb-6">Recherche avancée</h3>
           
           {/* Formulaire de recherche */}
           <div className="flex gap-2 mb-6">
             <div className="relative flex-grow">
               <input
                 type="text"
                 placeholder="Tapez votre recherche..."
                 className="input input-bordered w-full pl-12 text-lg"
                 value={searchQuery}
                 onChange={handleSearchChange}
                 autoFocus
               />
               <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                 {isSearching ? (
                   <span className="loading loading-spinner loading-sm"></span>
                 ) : (
                   <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                   </svg>
                 )}
               </div>
             </div>
           </div>
 
           {/* Résultats */}
           <div className="max-h-[60vh] overflow-y-auto">
             {isSearching ? (
               <div className="flex justify-center py-8">
                 <span className="loading loading-spinner loading-lg"></span>
               </div>
             ) : searchResults.length > 0 ? (
               <div className="space-y-4">
                 <h4 className="font-semibold text-lg mb-2">Résultats ({searchResults.length})</h4>
                 <div className="space-y-3">
                   {searchResults.map((result) => (
                     <Link
                       key={result.id}
                       to={`/posts/${result.slug}`}
                       className="block p-4 hover:bg-base-200 rounded-lg transition-colors border border-base-200"
                       onClick={() => setSearchModalOpen(false)}
                     >
                       <h5 className="font-bold text-lg">{result.titre}</h5>
                       {result.introduction && (
                         <p className="text-gray-600 mt-1">{result.introduction}</p>
                       )}
                       {result.categorie_id && (
                         <span className="badge badge-primary mt-2">{result.categorie.name}</span>
                       )}
                     </Link>
                   ))}
                 </div>
               </div>
             ) : searchQuery && !isSearching ? (
               <div className="text-center py-8">
                 <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                 <h3 className="mt-2 text-lg font-medium">Aucun résultat trouvé</h3>
                 <p className="mt-1 text-gray-500">Essayez avec d'autres termes de recherche</p>
               </div>
             ) : (
               <div className="text-center py-8 text-gray-500">
                 <p>Entrez un terme de recherche pour commencer</p>
                 <div className="mt-4 flex flex-wrap justify-center gap-2">
                   <span className="badge badge-outline cursor-pointer hover:badge-primary" onClick={() => setSearchQuery('React')}>React</span>
                   <span className="badge badge-outline cursor-pointer hover:badge-primary" onClick={() => setSearchQuery('JavaScript')}>JavaScript</span>
                   <span className="badge badge-outline cursor-pointer hover:badge-primary" onClick={() => setSearchQuery('CSS')}>CSS</span>
                 </div>
               </div>
             )}
           </div>
         </div>
 
         {/* Fermer en cliquant à l'extérieur */}
         <form method="dialog" className="modal-backdrop">
           <button onClick={() => setSearchModalOpen(false)}>Fermer</button>
         </form>
       </dialog>
 
      )}

      {/* Modal de Connexion */}
      <dialog open={loginModalOpen} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <button 
            onClick={() => setLoginModalOpen(false)} 
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </button>
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
              <label className="label cursor-pointer gap-2">
                <input type="checkbox" className="checkbox checkbox-primary" />
                <span className="label-text">Se souvenir de moi</span> 
              </label>
              
              <a href="#" className="text-sm link link-hover">Aide?</a>
            </div>
          </div>

          <div className="modal-action">
            <button 
              type="button" 
              onClick={() => setLoginModalOpen(false)} 
              className="btn btn-ghost"
            >
              Annuler
            </button>
            <button className="btn btn-primary">Se connecter</button>
          </div>
        </div>
        
        {/* Fermer en cliquant à l'extérieur */}
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setLoginModalOpen(false)}>close</button>
        </form>
      </dialog>
    </>
  );
};

export default Header;