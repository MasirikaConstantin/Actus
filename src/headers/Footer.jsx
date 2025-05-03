import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaRss } from 'react-icons/fa';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content mt-20 border-t border-base-300">
      {/* Section Principale */}
      <div className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Logo et Description */}
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-primary">Mascode</span>
            <span className="text-2xl font-bold">Actualités</span>
          </div>
          <p className="text-sm opacity-80">
            L'information instantanée et vérifiée. Notre engagement : vous fournir des actualités fiables en temps réel.
          </p>
          
          {/* Newsletter */}
          <div className="mt-4">
            <h3 className="font-bold text-lg mb-2">Newsletter</h3>
            <div className="join w-full">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="input input-bordered join-item w-full" 
              />
              <button className="btn btn-primary join-item">
                <MdEmail className="text-xl" />
              </button>
            </div>
          </div>
        </div>

        {/* Liens Rapides */}
        <div>
          <h3 className="footer-title">Navigation</h3>
          <ul className="space-y-2">
            <li><a className="link link-hover">Accueil</a></li>
            <li><a className="link link-hover">Actualités</a></li>
            <li><a className="link link-hover">Politique</a></li>
            <li><a className="link link-hover">Économie</a></li>
            <li><a className="link link-hover">Technologie</a></li>
            <li><a className="link link-hover">Sports</a></li>
          </ul>
        </div>

        {/* Légales et Infos */}
        <div>
          <h3 className="footer-title">Informations</h3>
          <ul className="space-y-2">
            <li><a className="link link-hover">À propos</a></li>
            <li><a className="link link-hover">Équipe éditoriale</a></li>
            <li><a className="link link-hover">Politique de confidentialité</a></li>
            <li><a className="link link-hover">Conditions d'utilisation</a></li>
            <li><a className="link link-hover">Publicité</a></li>
            <li><a className="link link-hover">Nous contacter</a></li>
          </ul>
        </div>

        {/* Contact et Réseaux */}
        <div>
          <h3 className="footer-title">Contact</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <MdLocationOn className="text-lg" />
              <span>123 Rue de l'Info, Paris 75000</span>
            </li>
            <li className="flex items-center gap-2">
              <MdPhone className="text-lg" />
              <a href="tel:+33123456789" className="link link-hover">+33 1 23 45 67 89</a>
            </li>
            <li className="flex items-center gap-2">
              <MdEmail className="text-lg" />
              <a href="mailto:contact@mascode-actus.com" className="link link-hover">contact@mascode-actus.com</a>
            </li>
          </ul>

          {/* Réseaux Sociaux */}
          <div className="mt-4">
            <h3 className="footer-title">Réseaux sociaux</h3>
            <div className="flex gap-4">
              <a className="btn btn-circle btn-ghost">
                <FaFacebook className="text-xl" />
              </a>
              <a className="btn btn-circle btn-ghost">
                <FaTwitter className="text-xl" />
              </a>
              <a className="btn btn-circle btn-ghost">
                <FaInstagram className="text-xl" />
              </a>
              <a className="btn btn-circle btn-ghost">
                <FaLinkedin className="text-xl" />
              </a>
              <a className="btn btn-circle btn-ghost">
                <FaYoutube className="text-xl" />
              </a>
              <a className="btn btn-circle btn-ghost">
                <FaRss className="text-xl" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Section Secondaire */}
      <div className="bg-base-300">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-sm">© {new Date().getFullYear()} MascodeActualités</span>
            <span className="hidden md:block">•</span>
            <span className="text-sm">Tous droits réservés</span>
          </div>
          
          <div className="flex gap-4 mt-4 md:mt-0">
            <a className="text-sm link link-hover">Mentions légales</a>
            <span>•</span>
            <a className="text-sm link link-hover">CGU</a>
            <span>•</span>
            <a className="text-sm link link-hover">Cookies</a>
            <span>•</span>
            <a className="text-sm link link-hover">GDPR</a>
          </div>
        </div>
      </div>

      {/* Badge "Retour en haut" */}
      <div className="fixed bottom-6 right-6">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="btn btn-circle btn-primary shadow-lg"
          aria-label="Retour en haut"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </div>
    </footer>
  );
};

export default Footer;