
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

import CardList from './pages/card/CardList'
import TransactionRecords from './pages/card/TransactionRecords'
import TopUp from './pages/account/TopUp'

// Placeholder components for lazy loading or direct import
import ApplyCard from './pages/card/ApplyCard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="card">
            <Route path="list" element={<CardList />} />
            <Route path="apply" element={<ApplyCard />} />
            <Route path="transactions" element={<TransactionRecords />} />
            {/* Redirect /card to /card/list by default */}
            <Route index element={<Navigate to="list" replace />} />
            <Route path="*" element={<div className="p-4">Page under construction</div>} />
          </Route>

          <Route path="account">
            <Route path="topup" element={<TopUp />} />
            <Route index element={<Navigate to="topup" replace />} />
            <Route path="*" element={<div className="p-4">Components coming soon</div>} />
          </Route>

          <Route path="*" element={<div className="p-4">404 Not Found</div>} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
