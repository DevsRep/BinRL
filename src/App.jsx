import { useState } from 'react'
import Home from './Home'
import { Route, BrowserRouter, Routes } from 'react-router-dom'
import Page from './RedirectPage'
import LinksPage from './LinksPage'
import LinkDirHome from './LinkDirHome'
import NewLinkDir from './NewLinkDir'
import LinkDirPage from './LinkDirPage'
import LinkDir from './LinkDir'
import LinkDirEdit from './LinkDirEdit'

function App() {

  return (
    
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path='/linkdir' element={<LinksPage />}>
          <Route index element={<LinkDirHome />} />
          <Route path="/linkdir/new" element={<NewLinkDir />}/>
          {/* <Route path="/linkdir/edit" element={<LinkDirEdit />}/> */}
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
