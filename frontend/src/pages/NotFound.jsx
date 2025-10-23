import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold mb-2">404</h1>
      <p className="mb-4">Page not found</p>
      <Link to="/">Go home</Link>
    </div>
  );
}
