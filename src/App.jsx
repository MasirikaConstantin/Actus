import './App.css'
import PostsList from './components/PostsList'
import Header from './headers/Header'
import Footer from './headers/Footer'
import { Routes, Route } from 'react-router-dom'
import ArticleDetail from './components/ArticleDetail'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto py-8">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <h1 className="text-3xl font-bold mb-6">Tous les Posts</h1>
                  <PostsList />
                </>
              }
            />

            {/* ✅ Ajoute cette route pour afficher les détails du post */}
            <Route
              path="/posts/:slug"
              element={<ArticleDetail />}
            />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
