import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginForm from './Pages/LoginForm'
import AdminDashboard from './Pages/AdminDashboard'
import AdminLogin from './Pages/AdminLogin'
import AdminProtectedRoute from './Pages/protected-routes/adminProtectedRoute'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm/>} />

        <Route path='/admin-dashboard' element={
          <AdminProtectedRoute>
            <AdminDashboard/>
          </AdminProtectedRoute>
        }/>
        
        <Route path='/admin-login' element={<AdminLogin/>}/>
      </Routes>
    </Router>
  )
}

export default App
