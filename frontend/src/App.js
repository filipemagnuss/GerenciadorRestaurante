import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProductList from './pages/ProductList';
import CreateAdmin from './pages/CreateAdmin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/create-admin" element={<CreateAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
