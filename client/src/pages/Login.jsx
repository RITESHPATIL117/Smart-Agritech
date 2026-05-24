import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Leaf, Mail, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData.email, formData.password);
    if (result.success) {
      toast.success('Login successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4'>
      <div className='max-w-md w-full'>
        <div className='bg-white rounded-2xl shadow-xl p-8 animate-scale-in motion-safe'>
          <div className='text-center mb-8'>
            <div className='flex items-center justify-center gap-2 mb-4'>
              <Leaf className='h-10 w-10 text-primary-600' />
              <h1 className='text-3xl font-bold text-gray-900'>Smart AgriTech</h1>
            </div>
            <p className='text-gray-600'>Sign in to your account</p>
          </div>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                <input type='email' name='email' value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className='input-field pl-10' required />
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                <input type='password' name='password' value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className='input-field pl-10' required />
              </div>
            </div>
            <button type='submit' disabled={loading} className='w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50'>
              {loading ? 'Signing in...' : <>Sign In <ArrowRight className='h-5 w-5' /></>}
            </button>
          </form>
          <p className='mt-6 text-center text-gray-600 text-sm'>
            No account? <Link to='/register' className='text-primary-600 font-medium'>Register</Link>
          </p>
          <p className='mt-2 text-center text-xs text-gray-500'>Demo: farmer@smartagritech.com / farmer123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
