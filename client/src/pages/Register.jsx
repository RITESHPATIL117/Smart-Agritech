import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Leaf, Mail, Lock, User, Phone, MapPin, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', location: '', farmSize: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register({
      ...formData,
      farmSize: formData.farmSize ? Number(formData.farmSize) : 0,
    });
    if (result.success) {
      toast.success('Registration successful!');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
    setLoading(false);
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4 py-8'>
      <div className='max-w-md w-full'>
        <div className='bg-white rounded-2xl shadow-xl p-8 animate-scale-in motion-safe'>
          <div className='text-center mb-8'>
            <div className='flex items-center justify-center gap-2 mb-4'>
              <Leaf className='h-10 w-10 text-primary-600' />
              <h1 className='text-3xl font-bold text-gray-900'>Smart AgriTech</h1>
            </div>
            <p className='text-gray-600'>Create your account</p>
          </div>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name</label>
              <div className='relative'>
                <User className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                <input type='text' name='name' value={formData.name} onChange={handleChange} className='input-field pl-10' required />
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                <input type='email' name='email' value={formData.email} onChange={handleChange} className='input-field pl-10' required />
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
              <div className='relative'>
                <Lock className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                <input type='password' name='password' value={formData.password} onChange={handleChange} className='input-field pl-10' minLength={6} required />
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Phone</label>
              <div className='relative'>
                <Phone className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                <input type='tel' name='phone' value={formData.phone} onChange={handleChange} className='input-field pl-10' />
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Location</label>
              <div className='relative'>
                <MapPin className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
                <input type='text' name='location' value={formData.location} onChange={handleChange} className='input-field pl-10' />
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Farm Size (acres)</label>
              <input type='number' name='farmSize' value={formData.farmSize} onChange={handleChange} className='input-field' min={0} />
            </div>
            <button type='submit' disabled={loading} className='w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50'>
              {loading ? 'Creating...' : <>Create Account <ArrowRight className='h-5 w-5' /></>}
            </button>
          </form>
          <p className='mt-6 text-center text-gray-600 text-sm'>
            Have an account? <Link to='/login' className='text-primary-600 font-medium'>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
