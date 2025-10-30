import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';

export default function Restaurants() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Temporary demo data if API not ready
/*   const fallback = [
    { name: 'KFC', slug: 'kfc', cuisine: 'Fried Chicken', rating: 4.3, logo_key: 'restaurants/kfc/logo.jpg' },
    { name: 'Domino\'s', slug: 'dominos', cuisine: 'Pizza', rating: 4.2, logo_key: 'restaurants/dominos/logo.jpg' },
    { name: 'Burger King', slug: 'burger-king', cuisine: 'Burgers', rating: 4.1, logo_key: 'restaurants/burger-king/logo.jpg' },
    { name: 'Biryani Blues', slug: 'biryani-blues', cuisine: 'Biryani', rating: 4.1, logo_key: 'restaurants/biryani-blues/logo.jpg' }
  ]; */

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get('/restaurants'); // will work once backend up
        if (!cancelled) setItems(res.data);
      } catch {
        if (!cancelled) setItems([]);
        /* if (!cancelled) setItems(fallback); */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => (cancelled = true);
  }, []);

  if (loading) return <p>Loading restaurants…</p>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((r) => (
        <Link
          to={`/restaurants/${r.slug}`}
          key={r.slug}
          className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-4 hover:shadow"
        >
          <img
            src={r.logo_key}
            alt={`${r.name} logo`}
            className="h-24 w-24 object-cover rounded-xl mb-3"
          />
          <div className="text-lg font-semibold">{r.name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{r.cuisine}</div>
          <div className="mt-1 text-sm">⭐ {r.rating ?? '4.0'}</div>
        </Link>
      ))}
    </div>
  );
}
