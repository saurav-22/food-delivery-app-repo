import React, { useEffect, useState } from 'react';
import api from '../api/client.js';

const DEFAULT_USER_ID = parseInt(import.meta.env.VITE_DEFAULT_USER_ID || '1', 10);

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      try {
  const res = await api.get(`/orders/${DEFAULT_USER_ID}`);
  console.debug('RAW /orders response', res);
  const d = res.data;
        if (Array.isArray(d)) {
          setOrders(d);
        } else if (d && typeof d === 'object') {
          // accept { orders: [...] } or object map
          if (Array.isArray(d.orders)) setOrders(d.orders);
          else setOrders(Object.values(d));
        } else {
          setOrders([]);
        }
      } catch (err) {
        console.error('fetch orders failed', err);
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>
      {orders.length === 0 && <div>No orders yet.</div>}
      {orders.map((o) => (
        <div key={o.id} className="border rounded p-3 mb-2">
          <div className="font-semibold">Order #{o.id}</div>
          <div>Status: {o.status}</div>
          <div>Total: ₹ {(o.total_paise/100).toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
}
