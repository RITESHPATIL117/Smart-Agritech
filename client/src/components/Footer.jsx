import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => (
  <footer className='bg-gray-800 text-white mt-auto'>
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div>
          <div className='flex items-center space-x-2 mb-4'>
            <Leaf className='h-6 w-6 text-primary-400' />
            <span className='text-lg font-bold'>Smart AgriTech</span>
          </div>
          <p className='text-gray-400 text-sm'>
            Empowering farmers with modern technology for sustainable agriculture.
          </p>
        </div>
        <div>
          <h3 className='text-lg font-semibold mb-4'>Quick Links</h3>
          <ul className='space-y-2 text-gray-400 text-sm'>
            <li><Link to='/' className='hover:text-primary-400'>Home</Link></li>
            <li><Link to='/about' className='hover:text-primary-400'>About Us</Link></li>
            <li><Link to='/contact' className='hover:text-primary-400'>Contact</Link></li>
            <li><Link to='/login' className='hover:text-primary-400'>Login</Link></li>
          </ul>
        </div>
        <div>
          <h3 className='text-lg font-semibold mb-4'>Contact Us</h3>
          <ul className='space-y-3 text-gray-400 text-sm'>
            <li className='flex items-center space-x-2'>
              <Mail className='h-4 w-4 text-primary-400' />
              <span>info@smartagritech.com</span>
            </li>
            <li className='flex items-center space-x-2'>
              <Phone className='h-4 w-4 text-primary-400' />
              <span>+91 1234567890</span>
            </li>
            <li className='flex items-center space-x-2'>
              <MapPin className='h-4 w-4 text-primary-400' />
              <span>New Delhi, India</span>
            </li>
          </ul>
        </div>
      </div>
      <div className='border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm'>
        <p>&copy; {new Date().getFullYear()} Smart AgriTech. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
