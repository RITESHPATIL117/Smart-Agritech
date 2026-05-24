import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Leaf, LogOut, User, Menu, X, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className='sticky top-0 z-40 bg-primary-600 text-white shadow-lg backdrop-blur-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <Link to='/' className='flex items-center space-x-2 group'>
            <Leaf className='h-8 w-8 motion-safe:group-hover:rotate-12 transition-transform duration-300' />
            <span className='text-xl font-bold'>Smart AgriTech</span>
          </Link>

          <div className='hidden md:flex items-center space-x-4'>
            <Link to='/' className='hover:text-primary-100 transition-colors'>Home</Link>
            <Link to='/about' className='hover:text-primary-100 transition-colors'>About</Link>
            <Link to='/contact' className='hover:text-primary-100 transition-colors'>Contact</Link>
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                  className='hover:text-primary-100 transition-colors'
                >
                  Dashboard
                </Link>
                {user?.role !== 'admin' && (
                  <>
                    <Link to='/marketplace' className='hover:text-primary-100 transition-colors'>
                      Marketplace
                    </Link>
                    <Link to='/cart' className='hover:text-primary-100 transition-colors flex items-center gap-1'>
                      <ShoppingCart className='h-4 w-4' />
                      Cart ({cartCount})
                    </Link>
                  </>
                )}
                <div className='flex items-center space-x-2'>
                  <User className='h-5 w-5' />
                  <span className='text-sm'>{user?.name}</span>
                </div>
                <button onClick={handleLogout} className='flex items-center space-x-1 hover:text-primary-100'>
                  <LogOut className='h-5 w-5' />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to='/login' className='bg-white text-primary-600 px-4 py-2 rounded-lg hover:bg-primary-50'>
                  Login
                </Link>
                <Link to='/register' className='bg-secondary-500 text-white px-4 py-2 rounded-lg hover:bg-secondary-600'>
                  Register
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className='md:hidden'>
            {isOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
          </button>
        </div>

        {isOpen && (
          <div className='md:hidden py-4 space-y-2 animate-slide-down border-t border-primary-500/50'>
            <Link to='/' className='block hover:text-primary-100' onClick={() => setIsOpen(false)}>Home</Link>
            <Link to='/about' className='block hover:text-primary-100' onClick={() => setIsOpen(false)}>About</Link>
            <Link to='/contact' className='block hover:text-primary-100' onClick={() => setIsOpen(false)}>Contact</Link>
            {isAuthenticated ? (
              <>
                <Link
                  to={user?.role === 'admin' ? '/admin' : '/dashboard'}
                  className='block hover:text-primary-100'
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                {user?.role !== 'admin' && (
                  <>
                    <Link to='/marketplace' className='block hover:text-primary-100' onClick={() => setIsOpen(false)}>
                      Marketplace
                    </Link>
                    <Link to='/cart' className='block hover:text-primary-100' onClick={() => setIsOpen(false)}>
                      Cart ({cartCount})
                    </Link>
                  </>
                )}
                <button onClick={handleLogout} className='flex items-center space-x-1 hover:text-primary-100'>
                  <LogOut className='h-5 w-5' />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to='/login' className='block bg-white text-primary-600 px-4 py-2 rounded-lg text-center' onClick={() => setIsOpen(false)}>
                  Login
                </Link>
                <Link to='/register' className='block bg-secondary-500 text-white px-4 py-2 rounded-lg text-center' onClick={() => setIsOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
