import React, { useEffect, useState } from 'react';
import api from '../api/client.js';

const DEFAULT_USER_ID = parseInt(import.meta.env.VITE_DEFAULT_USER_ID || '1', 10);

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    setLoading(true);
    try {
  const res = await api.get(`/cart/${DEFAULT_USER_ID}`);
  console.debug('RAW /cart response', res);
  const d = res.data;
      // normalize response shapes: expected { cart_id, restaurant_slug, items: [], subtotal_paise }
      if (Array.isArray(d)) {
        // some backends may return items array directly
        setCart({ cart_id: null, restaurant_slug: null, items: d, subtotal_paise: 0 });
      } else if (d && typeof d === 'object') {
        // common shapes
        if (Array.isArray(d.items)) {
          setCart(d);
        } else if (Array.isArray(d.items || d.cart_items || d.data)) {
          setCart({ cart_id: d.cart_id ?? null, restaurant_slug: d.restaurant_slug ?? null, items: d.items || d.cart_items || d.data, subtotal_paise: d.subtotal_paise || 0 });
        } else {
          // unknown shape -> defensively set empty
          setCart({ cart_id: d.cart_id ?? null, restaurant_slug: d.restaurant_slug ?? null, items: [], subtotal_paise: d.subtotal_paise || 0 });
        }
      } else {
        setCart({ cart_id: null, restaurant_slug: null, items: [], subtotal_paise: 0 });
      }
    } catch (err) {
      console.error('fetch cart failed', err);
      setCart({ cart_id: null, restaurant_slug: null, items: [], subtotal_paise: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQty = async (item, qty) => {
    if (qty <= 0) return;
    try {
  await api.put(`/cart/${DEFAULT_USER_ID}/items/${item.id}`, { qty });
      // optimistic refresh
      await fetchCart();
    } catch (err) {
      console.error('update qty failed', err);
      alert('Failed to update qty');
    }
  };

  const checkout = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      alert('Cart is empty');
      return;
    }
    try {
      // minimal payload — requires a valid address_id and payment_id; use 1 for demo
      const payload = { user_id: DEFAULT_USER_ID, address_id: 1, payment_id: 1 };
      const res = await api.post(`/orders`, payload);
      // handle JSON vs HTML responses defensively
      if (res && res.status >= 200 && res.status < 300) {
        if (res.data && typeof res.data === 'object' && ('id' in res.data)) {
          alert(`Order placed: ${res.data.id}`);
        } else if (res.data && typeof res.data === 'string') {
          // server returned HTML or plain text — show a friendly error
          console.warn('Checkout returned non-JSON response', res.data);
          alert('Order placed (response not JSON). Check backend response.');
        } else {
          alert('Order placed');
        }
      } else {
        const msg = res?.data?.error || 'Failed to place order';
        alert(msg);
      }
      // refresh cart (order-service clears cart)
      await fetchCart();
    } catch (err) {
      console.error('checkout failed', err);
      const msg = err?.response?.data?.error || 'Failed to place order';
      alert(msg);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Cart</h1>
      {loading && <div>Loading…</div>}
      {!loading && cart && (
        <div>
          {(!cart.items || cart.items.length === 0) && <div>Your cart is empty.</div>}
          {Array.isArray(cart.items) && cart.items.length > 0 && (
            <div>
              <div className="space-y-4">
                {cart.items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between border p-3 rounded">
                    <div>
                      <div className="font-semibold">Item {it.menu_item_id}</div>
                      <div className="text-sm text-gray-600">Price ₹{(it.price_snapshot_paise/100).toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => updateQty(it, it.qty - 1)} className="px-2">-</button>
                      <div>{it.qty}</div>
                      <button onClick={() => updateQty(it, it.qty + 1)} className="px-2">+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 font-semibold">Subtotal: ₹ {(cart.subtotal_paise/100).toFixed(2)}</div>
              <button onClick={checkout} className="mt-3 rounded bg-blue-600 text-white px-4 py-2">Checkout</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
