import { useState, useRef, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaShare, FaComment, FaArrowUp } from 'react-icons/fa';
import { useParams, Link } from 'react-router-dom';
import { getPostBySlug, getPostsByCategory } from '../services/api';

const ArticleDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [comment, setComment] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsPage, setCommentsPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState(null);
  const commentsSectionRef = useRef(null);
  const commentsObserver = useRef();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await getPostBySlug(slug);
        setArticle(response.data);
        setRelatedPosts(response.autres)
        setComments(response.data.commentaires || []);
        
        
      } catch (err) {
        setError("Article introuvable.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
    
  }, [slug]);
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadMoreComments = async () => {
    if (!hasMoreComments) return;
    
    try {
      // Simuler un appel API pour plus de commentaires
      // Remplacez par votre véritable appel API
      const newComments = []; // await fetchMoreComments(article.id, commentsPage + 1);
      
      if (newComments.length === 0) {
        setHasMoreComments(false);
        return;
      }
      
      setComments(prev => [...prev, ...newComments]);
      setCommentsPage(prev => prev + 1);
    } catch (err) {
      console.error("Erreur lors du chargement des commentaires", err);
    }
  };

  const lastCommentElementRef = useRef();
  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMoreComments) {
        loadMoreComments();
      }
    }, { threshold: 1.0 });

    if (lastCommentElementRef.current) {
      observer.observe(lastCommentElementRef.current);
    }

    commentsObserver.current = observer;
    return () => {
      if (commentsObserver.current) {
        commentsObserver.current.disconnect();
      }
    };
  }, [loading, hasMoreComments]);

  const scrollToComments = () => {
    commentsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    // Simulation d'ajout de commentaire
    const newComment = {
      id: Date.now(),
      user: { id: 'current-user', name: 'Vous' },
      contenu: comment,
      created_at: new Date().toISOString()
    };
    
    setComments(prev => [newComment, ...prev]);
    setComment('');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="alert alert-error max-w-md">{error}</div>
    </div>
  );
  
  if (!article) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="alert alert-warning max-w-md">Article non trouvé</div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 lg:px-8">
      {/* Bouton retour en haut */}
      {showScrollButton && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 btn btn-circle btn-primary shadow-lg z-50 hover:scale-105 transition-transform"
          aria-label="Retour en haut"
        >
          <FaArrowUp className="text-xl" />
        </button>
      )}

      {/* En-tête de l'article */}
      <article className="mb-12">
        <div className="text-sm breadcrumbs mb-6">
          <ul>
            <li><Link to="/" className="hover:text-primary">Accueil</Link></li> 
            {article.categorie && (
              <li>
                <Link 
                  to={`/categorie/${article.categorie.id}`} 
                  className="hover:text-primary"
                >
                  {article.categorie.name}
                </Link>
              </li>
            )}
            <li className="text-primary font-medium">{article.titre}</li>
          </ul>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{article.titre}</h1>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="avatar">
            <div className="w-12 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2">
              <img 
                src={`https://i.pravatar.cc/150?u=${article.user?.id}`} 
                alt={article.user?.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div>
            <p className="font-medium">{article.user?.name}</p>
            <p className="text-sm opacity-75">
              Publié le {new Date(article.created_at).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })} • {article.temps} min de lecture
            </p>
          </div>
        </div>

        {article.image && (
          <figure className="w-full h-auto max-h-[32rem] mb-10 rounded-xl overflow-hidden shadow-lg">
            <img 
              src={article.image} 
              alt={article.titre} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </figure>
        )}

        <div className="prose max-w-none mb-10">
          <p className="text-xl md:text-2xl leading-relaxed opacity-90">{article.introduction}</p>
        </div>

        {/* Actions sur l'article */}
        <div className="flex flex-wrap gap-4 mb-10 border-t border-b border-base-200 py-4">
          <button 
            onClick={() => setLiked(!liked)} 
            className="btn btn-ghost gap-2 hover:bg-base-200"
          >
            {liked ? (
              <FaHeart className="text-red-500 text-lg" />
            ) : (
              <FaRegHeart className="text-lg" />
            )}
            <span>{liked ? (article.true_reactions || 0) + 1 : article.true_reactions || 0}</span>
          </button>

          <button 
            onClick={() => setBookmarked(!bookmarked)} 
            className="btn btn-ghost gap-2 hover:bg-base-200"
          >
            {bookmarked ? (
              <FaBookmark className="text-yellow-500 text-lg" />
            ) : (
              <FaRegBookmark className="text-lg" />
            )}
            <span>Enregistrer</span>
          </button>

          <button className="btn btn-ghost gap-2 hover:bg-base-200">
            <FaShare className="text-lg" />
            <span>Partager</span>
          </button>

          <button 
            onClick={scrollToComments}
            className="btn btn-ghost gap-2 hover:bg-base-200"
          >
            <FaComment className="text-lg" />
            <span>{article.commentaires_count || 0} commentaires</span>
          </button>
        </div>
      </article>

      {/* Sections de l'article */}
      <div className="mb-16">
        {article.sections?.map((section, index) => (
          <section key={section.id || index} className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">{section.titre}</h2>
            {section.image && (
              <figure className={`${index % 2 === 0 ? 'float-right ml-8' : 'float-left mr-8'} mb-6 w-full md:w-1/2 lg:w-1/3`}>
                <img 
                  src={section.image} 
                  alt={section.titre} 
                  className="rounded-xl shadow-md"
                  loading="lazy"
                />
                {section.image_legend && (
                  <figcaption className="text-sm text-center mt-2 opacity-75">
                    {section.image_legend}
                  </figcaption>
                )}
              </figure>
            )}
            <div className="prose max-w-none">
              {section.contenu?.split('\n').map((paragraph, i) => (
                <p key={i} className="mb-5 text-lg leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Section commentaires */}
      <div ref={commentsSectionRef} className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-primary">
          Commentaires ({article.commentaires_count || 0})
        </h2>
        
        <form onSubmit={handleCommentSubmit} className="mb-10 bg-base-100 rounded-xl p-6 shadow-sm">
          <div className="flex gap-4">
            <div className="avatar">
              <div className="w-12 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-1">
                <img src="https://i.pravatar.cc/150?u=current-user" alt="Votre avatar" />
              </div>
            </div>
            <div className="flex-grow">
              <textarea
                className="textarea textarea-bordered w-full mb-4 text-lg"
                placeholder="Ajouter un commentaire..."
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <button type="submit" className="btn btn-primary px-6">
                Publier
              </button>
            </div>
          </div>
        </form>

        <div className="space-y-6">
          {comments.map((commentaire, index) => {
            if (comments.length === index + 1) {
              return (
                <div 
                  ref={lastCommentElementRef}
                  key={commentaire.id} 
                  className="flex gap-4"
                >
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <img 
                        src={`https://i.pravatar.cc/150?u=${commentaire.user?.id}`} 
                        alt={commentaire.user?.name} 
                      />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="bg-base-200 rounded-xl p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-lg">
                          {commentaire.user?.name}
                        </h3>
                        <span className="text-sm opacity-75">
                          {new Date(commentaire.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="text-lg">{commentaire.contenu}</p>
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={commentaire.id} className="flex gap-4">
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <img 
                        src={`https://i.pravatar.cc/150?u=${commentaire.user?.id}`} 
                        alt={commentaire.user?.name} 
                      />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="bg-base-200 rounded-xl p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-medium text-lg">
                          {commentaire.user?.name}
                        </h3>
                        <span className="text-sm opacity-75">
                          {new Date(commentaire.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="text-lg">{commentaire.contenu}</p>
                    </div>
                  </div>
                </div>
              );
            }
          })}

          {hasMoreComments && comments.length > 0 && (
            <div className="flex justify-center mt-8">
              <button 
                onClick={loadMoreComments}
                className="btn btn-ghost loading"
                disabled
              >
                Chargement...
              </button>
            </div>
          )}

          {comments.length === 0 && (
            <div className="text-center py-10">
              <p className="text-xl opacity-75">Aucun commentaire pour le moment</p>
              <p className="mt-2">Soyez le premier à commenter !</p>
            </div>
          )}
        </div>
      </div>

      {/* Articles similaires */}
      {/* Articles similaires */}
{relatedPosts?.data?.length > 0 && (
  <div className="mb-16">
    <h2 className="text-2xl md:text-3xl font-bold mb-8 text-primary">
      Dans la même catégorie
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {relatedPosts.data.map((post) => (
        <div 
          key={post.id} 
          className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow hover:-translate-y-1"
        >
          <Link to={`/posts/${post.slug}`} className="h-full flex flex-col">
            <figure className="h-48 overflow-hidden">
              <img 
                src={post.image} 
                alt={post.titre} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </figure>
            <div className="card-body flex-grow">
              <h3 className="card-title text-xl">{post.titre}</h3>
              <p className="line-clamp-2 text-lg">{post.introduction}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="badge badge-outline badge-primary">
                  {article.categorie?.name}
                </span>
                <span className="text-sm opacity-75">{post.temps} min</span>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
    
    {/* Pagination si nécessaire */}
    {relatedPosts.pagination && relatedPosts.pagination.last_page > 1 && (
      <div className="flex justify-center mt-8">
        <div className="join">
          {Array.from({ length: relatedPosts.pagination.last_page }, (_, i) => i + 1).map(page => (
            <button 
              key={page} 
              className={`join-item btn ${relatedPosts.pagination.current_page === page ? 'btn-primary' : ''}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    )}
  </div>
)}
    </div>
  );
};

export default ArticleDetail;