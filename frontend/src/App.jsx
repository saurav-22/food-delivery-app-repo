import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router/index.jsx';
import Header from './components/Header.jsx';

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
        <RouterProvider router={router} />
      </div>
    </div>
  );
}
