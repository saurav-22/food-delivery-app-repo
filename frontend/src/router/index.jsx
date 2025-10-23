import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Restaurants from '../pages/Restaurants.jsx';
import RestaurantMenu from '../pages/RestaurantMenu.jsx';
import Cart from '../pages/Cart.jsx';
import Orders from '../pages/Orders.jsx';
import NotFound from '../pages/NotFound.jsx';

const router = createBrowserRouter([
  { path: '/', element: <Restaurants /> },
  { path: '/restaurant/:slug', element: <RestaurantMenu /> },
  { path: '/cart', element: <Cart /> },
  { path: '/orders', element: <Orders /> },
  { path: '*', element: <NotFound /> }
]);

export default router;
