import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
// Import all page components
import Restaurants from './pages/Restaurants.jsx';
import RestaurantMenu from './pages/RestaurantMenu.jsx';
import Cart from './pages/Cart.jsx';
import Orders from './pages/Orders.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  // Initialize dark mode from localStorage
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    return stored ? stored === 'dark' : false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <Header dark={dark} setDark={setDark} />
      <div className="container py-6">
        {/* This is where different pages will show up */}
        <Routes>
          {/* Show Restaurants page when someone goes to homepage */}
          <Route path="/" element={<Restaurants />} />
          
          {/* Show restaurant menu when URL has restaurant ID */}
          <Route path="/restaurants/:slug" element={<RestaurantMenu />} />
          
          {/* Show cart page */}
          <Route path="/cart" element={<Cart />} />
          
          {/* Show orders page */}
          <Route path="/orders" element={<Orders />} />
          
          {/* Show 404 page for any other URL */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}
