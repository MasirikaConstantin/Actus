import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { getAllPostsByCategory,getCategorie } from '../services/api';
import { useInsertionEffect } from 'react';

const CategoryPage = () => {

  const { category } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [cat, setcats] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  function useDocumentTitle(title) {
    useInsertionEffect(() => {
      document.title = title;
    }, [title]);
  }
  
  // Chargement des posts d'une catégorie avec votre API
  // Chargement des posts et de la catégorie en une seule opération
useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Exécute les deux requêtes en parallèle
        const [postsResponse, categoryResponse] = await Promise.all([
          getAllPostsByCategory(category),
          getCategorie(category)
        ]);
        
        setPosts(postsResponse.data || []);
        setcats(categoryResponse.data || []);
        setFilteredPosts(postsResponse.data || []);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        setPosts([]);
        setcats([]);
        setFilteredPosts([]);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [category]);
  useDocumentTitle(cat.name);

  // Filtrage local des posts
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post => 
        post.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.introduction && post.introduction.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (post.contenu && post.contenu.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  return (
    
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold capitalize">{cat.name}</h1>
          <p className="text-gray-600">
            {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'} trouvés
          </p>
        </div>
        
        {/* Barre de recherche locale */}
        <div className="join w-full md:w-96">
          <input
            type="text"
            placeholder={`Rechercher dans ${cat.name}...`}
            className="input input-bordered join-item w-full"
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

      {isLoading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium">
            {searchQuery ? 'Aucun résultat trouvé' : 'Aucun article dans cette catégorie'}
          </h3>
          <p className="mt-1 text-gray-500">
            {searchQuery ? 'Essayez avec d\'autres termes' : 'Revenez plus tard pour découvrir de nouveaux contenus'}
          </p>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')} 
              className="btn btn-ghost mt-4"
            >
              Réinitialiser la recherche
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <div key={post.id} className="card bg-base-200 shadow-xl hover:shadow-2xl transition-shadow">
              <figure>
                {post.image && (
                  <img 
                    src={post.image} 
                    alt={post.titre} 
                    className="w-full h-48 object-cover"
                  />
                )}
              </figure>
              <div className="card-body">
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge badge-primary">{post.categorie.name}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
                <h2 className="card-title">
                  <Link to={`/posts/${post.slug}`} className="hover:text-primary">
                    {post.titre}
                  </Link>
                </h2>
                {post.introduction && (
                  <p className="text-gray-600 line-clamp-2">
                    {post.introduction}
                  </p>
                )}
                <div className="card-actions justify-end mt-4">
                  <Link 
                    to={`/posts/${post.slug}`} 
                    className="btn btn-primary btn-sm"
                  >
                    Lire l'article
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

};
export default CategoryPage;
