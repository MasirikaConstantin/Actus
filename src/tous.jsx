import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PostsList from './components/PostsList'
import Header from './headers/Header'
import Footer from './headers/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
          <main className="flex-grow">
            <div className="container mx-auto py-8">
              <h1 className="text-3xl font-bold mb-6">Tout les Posts</h1>
              <PostsList />
            </div>
          </main>
        <Footer />
      </div>
      
    </>
  )
}

export default App
