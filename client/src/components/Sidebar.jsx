import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Sprout,
  FlaskConical,
  CloudSun,
  Stethoscope,
  User,
  LogOut,
  History,
  Store,
  ShoppingCart,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const farmerMenuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/marketplace', icon: Store, label: 'Marketplace' },
    { path: '/cart', icon: ShoppingCart, label: 'Cart' },
    { path: '/crop-recommendation', icon: Sprout, label: 'Crop Recommendation' },
    { path: '/fertilizer-recommendation', icon: FlaskConical, label: 'Fertilizer' },
    { path: '/weather', icon: CloudSun, label: 'Weather' },
    { path: '/disease-detection', icon: Stethoscope, label: 'Disease Detection' },
    { path: '/history', icon: History, label: 'My History' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const adminMenuItems = [{ path: '/admin', icon: LayoutDashboard, label: 'Admin Dashboard' }];

  const menuItems = user?.role === 'admin' ? adminMenuItems : farmerMenuItems;

  return (
    <aside className='relative w-64 bg-white shadow-lg min-h-screen hidden lg:block'>
      <div className='p-6'>
        <h2 className='text-xl font-bold text-primary-600 mb-6'>Menu</h2>
        <nav className='space-y-2'>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 font-medium shadow-sm translate-x-1'
                    : 'text-gray-600 hover:bg-gray-100 hover:translate-x-0.5'
                }`}
              >
                <Icon className='h-5 w-5' />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className='absolute bottom-0 left-0 right-0 p-6'>
        <button
          onClick={() => {
            logout();
            window.location.href = '/';
          }}
          className='flex items-center space-x-3 px-4 py-3 w-full text-gray-600 hover:bg-gray-100 rounded-lg'
        >
          <LogOut className='h-5 w-5' />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
