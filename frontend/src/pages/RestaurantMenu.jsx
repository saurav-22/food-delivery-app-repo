import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/client.js';

const DEFAULT_USER_ID = parseInt(import.meta.env.VITE_DEFAULT_USER_ID || '1', 10);

export default function RestaurantMenu() {
  const { slug } = useParams();
  const [menu, setMenu] = useState([]);
  const [info, setInfo] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [r, m] = await Promise.all([
          api.get(`/restaurants/${slug}`),
          api.get(`/menu/${slug}`)
        ]);
        if (!cancelled) {
          setInfo(r.data);
          setMenu(m.data);
        }
      } catch (error) {
        console.error('API error:', error);
        // fallback until APIs ready
        /* setInfo({ name: slug.toUpperCase(), slug, cuisine: '—', rating: 4.0, logo_key: `restaurants/${slug}/logo.jpg` });
        setMenu([
          { id: 1, name: 'Sample Item 1', description: 'Tasty!', price_paise: 19900, image_key: `restaurants/${slug}/menu-1.jpg` },
          { id: 2, name: 'Sample Item 2', description: 'Yum!', price_paise: 24900, image_key: `restaurants/${slug}/menu-2.jpg` }
        ]); */
      }
    })();
    return () => (cancelled = true);
  }, [slug]);

  const addToCart = async (item) => {
    try {
      const payload = {
        restaurant_slug: slug,
        // ensure numeric fields are numbers (server expects ints)
        menu_item_id: Number(item.id),
        price_paise: Number(item.price_paise),
        qty: 1
      };
      const res = await api.post(`/cart/${DEFAULT_USER_ID}/items`, payload);
      console.debug('POST /cart response', res);
      // simple feedback — keep UI minimal for showcase
      alert(`Added ${item.name} to cart`);
    } catch (err) {
      console.error('Add to cart failed', err);
      alert('Failed to add to cart');
    }
  };

  return (
    <div>
      <Link to="/" className="text-sm">&larr; Back to restaurants</Link>
      {info && (
        <div className="mt-3 mb-6 flex items-center gap-4">
          <img
            src={info.logo_key}
            alt={`${info.name} logo`}
            className="h-16 w-16 object-cover rounded-lg"
          />
          <div>
            <div className="text-2xl font-semibold">{info.name}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{info.cuisine} · ⭐ {info.rating}</div>
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {menu.map((m) => (
          <div key={m.id} className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden">
            <img src={m.image_key} alt={m.name} className="h-44 w-full object-cover" />
            <div className="p-4">
              <div className="font-semibold">{m.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{m.description ?? ''}</div>
              <div className="mt-2 font-semibold">₹ {(m.price_paise / 100).toFixed(2)}</div>
              <button
                onClick={() => addToCart(m)}
                className="mt-3 w-full rounded-lg border border-gray-300 dark:border-gray-700 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Add to cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
