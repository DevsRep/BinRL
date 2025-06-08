import { useState } from 'react'
import Home from './Home'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Page from './RedirectPage'


function App() {
  const [count, setCount] = useState(0)

  return (
    
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path='/:id' element={<Page />} />

      </Routes>
    </BrowserRouter>

  ) 
}

export default App
