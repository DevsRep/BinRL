import { useState } from 'react'
import Home from './Home'
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom'
import Page from './RedirectPage'
import LinksPage from './LinksPage'
import LinkDirHome from './LinkDirHome'
import NewLinkDir from './NewLinkDir'
import LinkDirPage from './LinkDirPage'
import LinkDir from './LinkDir'
import LinkDirEdit from './LinkDirEdit'
import { AuthProvider, useAuth } from './AuthContext'
import Login from './Login'
import Register from './Register'

const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {

  return (
    
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/linkdir' element={<PrivateRoute><LinksPage /></PrivateRoute>}>
            <Route index element={<PrivateRoute><LinkDirHome /></PrivateRoute>} />
            <Route path="/linkdir/new" element={<PrivateRoute><NewLinkDir /></PrivateRoute>}/>
            <Route path="/linkdir/edit" element={<PrivateRoute><LinkDirEdit /></PrivateRoute>}/>
          </Route>
          
          <Route path="/l" element={<LinkDirPage />}>
            <Route path=':id' element={<LinkDir />} />
          </Route>
          <Route path='/:id' element={<Page />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>

  ) 
}

export default App
