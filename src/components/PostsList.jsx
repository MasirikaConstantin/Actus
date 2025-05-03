import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { getPosts } from '../services/api' // Assurez-vous que le chemin est correct
import PostCard from './PostCard'

export default function PostsList() {
  const [state, setState] = useState({
    posts: [],
    currentPage: 1,
    loading: false,
    error: null,
    hasMore: true
  })

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  })

  const fetchPosts = async () => {
    if (state.loading || !state.hasMore) return

    setState(prev => ({ ...prev, loading: true, error: null }))

    try {
      // Utilisez votre service API avec la page actuelle
      const response = await getPosts(state.currentPage)
      
      // Accédez correctement à l'objet posts et à ses données
      const postsData = response.posts.data || []
      
      setState(prev => ({
        ...prev,
        posts: [...prev.posts, ...postsData],
        currentPage: prev.currentPage + 1,
        hasMore: response.posts.current_page < response.posts.last_page,
        loading: false
      }))
    } catch (error) {
      console.error('API Error:', error)
      setState(prev => ({
        ...prev,
        error: error.response?.data?.message || 'Erreur de chargement',
        loading: false
      }))
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  useEffect(() => {
    if (inView && !state.loading && state.hasMore) {
      fetchPosts()
    }
  }, [inView])

  if (state.error) {
    return (
      <div className="alert alert-error my-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{state.error}</span>
        <button 
          className="btn btn-sm btn-outline"
          onClick={fetchPosts}
        >
          Réessayer
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {state.posts.length === 0 && !state.loading ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          Aucun article disponible
        </div>
      ) : (
        state.posts.map((post, index) => (
          <PostCard 
            key={`${post.id}-${index}`}
            post={post} 
            isLast={index === state.posts.length - 1}
            innerRef={index === state.posts.length - 1 ? ref : null}
          />
        ))
      )}

      {state.loading && (
        <div className="col-span-full flex justify-center my-8">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      )}

      {!state.hasMore && state.posts.length > 0 && (
        <div className="col-span-full text-center py-8 text-gray-500">
          Vous avez atteint la fin des articles
        </div>
      )}
    </div>
  )
}