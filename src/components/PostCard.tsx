import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: number;
  titre: string;
  slug: string;
  introduction: string;
  image: string | null;
  temps: number;
  created_at: string;
  true_reactions: number;
  commentaires_count: number;
  vues: number;
  categorie: {
    name: string;
  };
}

interface PostCardProps {
  post: Post;
  isLast?: boolean;
  innerRef?: React.Ref<HTMLDivElement>;
}

const PostCard = React.forwardRef<HTMLDivElement, PostCardProps>(
  ({ post, isLast = false, innerRef }, ref) => {
    const navigate = useNavigate();

    const formattedDate = new Date(post.created_at).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const handleClick = () => {
      navigate(`/posts/${post.slug}`);
    };

    return (
      <div
        ref={isLast ? innerRef : ref}
        className="card bg-base-200 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
        onClick={handleClick}
      >
        <figure className="relative h-48 overflow-hidden">
          <img
            src={post.image || "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"}
            alt={post.titre}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-2 right-2 badge badge-primary">
            {post.categorie?.name || 'Non catégorisé'}
          </div>
        </figure>

        <div className="card-body p-4">
          <h2 className="card-title text-lg hover:text-primary">
            {post.titre}
          </h2>
          
          <p className="text-gray-600 line-clamp-3 mb-3">
            {post.introduction}
          </p>

          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <span>{formattedDate}</span>
            <span>{post.temps} min de lecture</span>
          </div>
          

          <div className="card-actions justify-between items-center">
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                👍 {post.true_reactions || 0}
              </span>
              <span className="flex items-center gap-1">
                💬 {post.commentaires_count || 0}
              </span>
              <span className="flex items-center gap-1">
                👀 {post.vues || 0}
              </span>
            </div>
            <button className="btn btn-sm btn-primary">
              Lire l'article
            </button>
          </div>
        </div>
      </div>
    );
  }
);

PostCard.displayName = 'PostCard';

export default PostCard;