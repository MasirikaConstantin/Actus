import { useState, useRef, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaShare, FaComment, FaArrowUp } from 'react-icons/fa';
import { useParams, Link } from 'react-router-dom';
import { getPostBySlug } from '../services/api';

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
  const [commentsPerPage] = useState(5);
  const [relatedPosts, setRelatedPosts] = useState(null);
  const commentsSectionRef = useRef(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await getPostBySlug(slug);
        setArticle(response.data);
        setRelatedPosts(response.autres);
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

  const scrollToComments = () => {
    commentsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    
    const newComment = {
      id: Date.now(),
      user: { id: 'current-user', name: 'Vous' },
      contenu: comment,
      created_at: new Date().toISOString()
    };
    
    setComments(prev => [newComment, ...prev]);
    setComment('');
  };

  const loadMoreComments = () => {
    setCommentsPage(prev => prev + 1);
  };

  const displayedComments = comments.slice(0, commentsPage * commentsPerPage);
  const hasMoreComments = displayedComments.length < comments.length;

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
    <div className="max-w-7xl mx-auto px-4 py-8 lg:px-8 flex flex-col lg:flex-row gap-8">
      {/* Contenu principal */}
      <div className="flex-1">
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
                  {section.image && (
                    <figcaption className="text-sm text-center mt-2 opacity-75">
                      {section.titre}
                    </figcaption>
                  )}
                </figure>
              )}
              <div className="prose max-w-none">
                  <div
                    className="text-lg leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: section.contenu }}
                  />
                </div>

            </section>
          ))}
        </div>

        {/* Section commentaires */}
        <div ref={commentsSectionRef} className="mb-16 bg-base-250">
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

          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4" style={{ scrollbarWidth: 'thin' }}>
            {displayedComments.map((commentaire) => (
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
            ))}

            {hasMoreComments && (
              <div className="flex justify-center mt-4">
                <button 
                  onClick={loadMoreComments}
                  className="btn btn-ghost"
                >
                  Voir plus de commentaires
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
      </div>

      {/* Sidebar avec articles similaires */}
      {relatedPosts?.data?.length > 0 && (
        <div className="lg:w-80 xl:w-96 flex-shrink-0">
          <div className="sticky top-4">
            <h2 className="text-xl font-bold mb-6 text-primary">
              Dans la même catégorie
            </h2>
            <div className="space-y-6">
              {relatedPosts.data.slice(0, 3).map((post) => (
                <div 
                  key={post.id} 
                  className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <Link to={`/article/${post.slug}`} className="h-full flex flex-col">
                    <figure className="h-40 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.titre} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </figure>
                    <div className="card-body p-4">
                      <h3 className="card-title text-lg line-clamp-2">{post.titre}</h3>
                      <div className="flex justify-between items-center mt-2">
                        <span className="badge badge-outline badge-primary text-xs">
                          {article.categorie?.name}
                        </span>
                        <span className="text-xs opacity-75">{post.temps} min</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
              
              {relatedPosts.data.length > 3 && (
                <div className="text-center">
                  <Link 
                    to={`/categorie/${article.categorie?.id}`} 
                    className="link link-primary text-sm"
                  >
                    Voir tous les articles ({relatedPosts.data.length - 3} de plus)
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleDetail;