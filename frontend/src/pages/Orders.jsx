import React, { useEffect, useState } from 'react';
import api from '../api/client.js';

const ORDER_BASE = import.meta.env.VITE_ORDER_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8085';
const DEFAULT_USER_ID = parseInt(import.meta.env.VITE_DEFAULT_USER_ID || '1', 10);

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`${ORDER_BASE}/orders/${DEFAULT_USER_ID}`);
        setOrders(res.data || []);
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
