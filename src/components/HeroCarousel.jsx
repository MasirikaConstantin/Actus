import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCarouselPosts } from '../services/api';

const HeroCarousel = () => {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [autoplay, setAutoplay] = useState(true);

  // Récupération des posts dès l'ouverture
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getCarouselPosts();
        setPosts(data);
      } catch (error) {
        console.error("Erreur de chargement du carousel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Autoplay toutes les 5 secondes
  useEffect(() => {
    if (!autoplay || posts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev === posts.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, posts.length]);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev === posts.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev === 0 ? posts.length - 1 : prev - 1));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[500px] bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!posts.length) {
    return (
      <div className="h-[500px] flex items-center justify-center bg-base-200">
        <p className="text-xl">Aucun article à afficher</p>
      </div>
    );
  }

  return (
    <section className="relative w-full h-[600px] mb-16 overflow-hidden rounded rounded-b-3xl">
      {/* Boutons de navigation */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 z-20 btn btn-circle btn-primary shadow-xl transform -translate-y-1/2 hover:scale-110 transition-all"
        aria-label="Article précédent"
      >
        ❮
      </button>
      
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 z-20 btn btn-circle btn-primary shadow-xl transform -translate-y-1/2 hover:scale-110 transition-all"
        aria-label="Article suivant"
      >
        ❯
      </button>

      {/* Conteneur du carousel */}
      <div className="relative w-full h-full">
        {posts.map((post, index) => (
          <div
            key={post.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Image de fond */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${post.image})` }}
            >
              <div className="absolute inset-0 bg-black/50"></div>
            </div>

            {/* Contenu */}
            <div className="relative z-10 flex items-center justify-center h-full px-4">
              <div className="max-w-4xl w-full text-center text-white p-8 backdrop-blur-sm bg-black/30 rounded-xl border border-white/10">
                <span className="inline-block px-3 py-1 mb-4 text-sm font-semibold text-white bg-primary rounded-full">
                  {post.categorie.name}
                </span>
                
                <h2 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
                  {post.titre}
                </h2>
                
                <p className="mb-8 text-lg md:text-xl max-w-2xl mx-auto">
                  {post.introduction}
                </p>
                
                <div className="flex justify-center gap-6 mb-8">
                  <span className="flex items-center gap-2">
                    👍 {post.true_reactions}
                  </span>
                  <span className="flex items-center gap-2">
                    👎 {post.false_reactions}
                  </span>
                  <span className="flex items-center gap-2">
                    💬 {post.commentaires_count}
                  </span>
                </div>
                
                <Link
                  to={`/posts/${post.slug}`}
                  className="btn btn-primary btn-lg px-8 py-3 text-lg font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  Lire l'article complet
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indicateurs */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
        {posts.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setAutoplay(false);
              setTimeout(() => setAutoplay(true), 3000);
            }}
            className={`w-4 h-4 rounded-full transition-all ${index === currentIndex ? 'bg-primary w-8' : 'bg-white/50'}`}
            aria-label={`Aller à l'article ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;