import { useState } from 'react'
import Home from './Home'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Page from './RedirectPage'
import LinksPage from './LinksPage'
import LinkDirHome from './LinkDirHome'
import NewLinkDir from './NewLinkDir'
import LinkDirPage from './LinkDirPage'
import LinkDir from './LinkDir'

function App() {
  const [count, setCount] = useState(0)

  return (
    
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path='/links' element={<LinksPage />}>
          <Route index element={<LinkDirHome />} />
          <Route path="/links/new" element={<NewLinkDir />}/>
        </Route>
        <Route path="/l" element={<LinkDirPage />}>
          <Route path=':id' element={<LinkDir />} />
        </Route>
        <Route path='/:id' element={<Page />} />

      </Routes>
    </BrowserRouter>

  ) 
}

export default App
