import { createBrowserRouter } from 'react-router';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Home,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/signup',
    Component: Signup,
  },
  {
    path: '/shop',
    Component: Shop,
  },
  {
    path: '/checkout',
    Component: Checkout,
  },
  {
    path: '/dashboard',
    Component: Dashboard,
  },
]);
