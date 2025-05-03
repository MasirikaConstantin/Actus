import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PostsList from './components/PostsList'
import Header from './headers/Header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
          <Header />
     <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Latest Posts</h1>
      <PostsList />
    </div>
      
    </>
  )
}

export default App
