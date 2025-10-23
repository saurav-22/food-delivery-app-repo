import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header({ dark, setDark }) {
  const loc = useLocation();
  const active = (path) =>
    loc.pathname === path
      ? 'text-blue-600 dark:text-blue-400 font-semibold'
      : 'text-gray-700 dark:text-gray-300';

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-950/70 sticky top-0 backdrop-blur z-50">
      <div className="container flex items-center justify-between py-3">
        <Link to="/" className="text-xl font-bold">
          🍔 FoodApp
        </Link>

        <nav className="flex gap-6">
          <Link to="/" className={active('/')}>
            Restaurants
          </Link>
          <Link to="/cart" className={active('/cart')}>
            Cart
          </Link>
          <Link to="/orders" className={active('/orders')}>
            Orders
          </Link>
        </nav>

        <button
          onClick={() => setDark((d) => !d)}
          className="rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Toggle dark mode"
          title="Toggle dark mode"
        >
          {dark ? '🌙 Dark' : '☀️ Light'}
        </button>
      </div>
    </header>
  );
}
