import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { User, Mail, Phone, MapPin, Ruler, Save, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const FarmerProfile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    farmSize: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        farmSize: user.farmSize || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await updateProfile({
      ...formData,
      farmSize: formData.farmSize ? Number(formData.farmSize) : 0,
    });

    if (result.success) {
      toast.success('Profile updated successfully!');
    } else {
      toast.error(result.message);
    }

    setLoading(false);
  };

  return (
    <div className='flex'>
      <Sidebar />
      <div className='flex-1 p-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Farmer Profile</h1>
          <p className='text-gray-600 mt-2'>Manage your account information and farm details.</p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='card'>
            <div className='text-center'>
              <div className='relative inline-block'>
                <div className='w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                  <User className='h-16 w-16 text-primary-600' />
                </div>
                <button className='absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors'>
                  <Camera className='h-4 w-4' />
                </button>
              </div>
              <h2 className='text-xl font-semibold text-gray-900'>{user?.name}</h2>
              <p className='text-gray-600'>{user?.email}</p>
              <span className='inline-block mt-2 bg-primary-100 text-primary-800 text-xs font-medium px-3 py-1 rounded-full'>
                {user?.role === 'admin' ? 'Admin' : 'Farmer'}
              </span>
            </div>

            <div className='mt-6 pt-6 border-t border-gray-200'>
              <div className='space-y-3 text-sm'>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-500'>Member Since</span>
                  <span className='font-medium text-gray-900'>
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-500'>Farm Size</span>
                  <span className='font-medium text-gray-900'>{user?.farmSize || 0} acres</span>
                </div>
                <div className='flex items-center justify-between'>
                  <span className='text-gray-500'>Location</span>
                  <span className='font-medium text-gray-900'>{user?.location || 'Not set'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className='lg:col-span-2 card'>
            <h2 className='text-xl font-semibold text-gray-900 mb-6'>Edit Profile</h2>
            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Full Name</label>
                  <div className='relative'>
                    <User className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                    <input
                      type='text'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      className='input-field pl-10'
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
                  <div className='relative'>
                    <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                    <input
                      type='email'
                      name='email'
                      value={formData.email}
                      onChange={handleChange}
                      className='input-field pl-10'
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Phone Number</label>
                  <div className='relative'>
                    <Phone className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                    <input
                      type='tel'
                      name='phone'
                      value={formData.phone}
                      onChange={handleChange}
                      className='input-field pl-10'
                      placeholder='+91 1234567890'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Location</label>
                  <div className='relative'>
                    <MapPin className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                    <input
                      type='text'
                      name='location'
                      value={formData.location}
                      onChange={handleChange}
                      className='input-field pl-10'
                      placeholder='City, State'
                    />
                  </div>
                </div>

                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Farm Size (acres)</label>
                  <div className='relative'>
                    <Ruler className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                    <input
                      type='number'
                      name='farmSize'
                      value={formData.farmSize}
                      onChange={handleChange}
                      className='input-field pl-10'
                      placeholder='Enter farm size in acres'
                      min='0'
                    />
                  </div>
                </div>
              </div>

              <div className='flex justify-end space-x-4'>
                <button
                  type='button'
                  onClick={() => {
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                      location: user?.location || '',
                      farmSize: user?.farmSize || '',
                    });
                  }}
                  className='px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={loading}
                  className='btn-primary flex items-center space-x-2 disabled:opacity-50'
                >
                  {loading ? 'Saving...' : (
                    <>
                      <Save className='h-5 w-5' />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className='card mt-8'>
          <h2 className='text-xl font-semibold text-gray-900 mb-6'>Account Statistics</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-primary-50 rounded-lg p-6 text-center'>
              <div className='text-3xl font-bold text-primary-600 mb-2'>0</div>
              <div className='text-sm text-gray-600'>Total Recommendations</div>
            </div>
            <div className='bg-green-50 rounded-lg p-6 text-center'>
              <div className='text-3xl font-bold text-green-600 mb-2'>0</div>
              <div className='text-sm text-gray-600'>Crop Suggestions</div>
            </div>
            <div className='bg-blue-50 rounded-lg p-6 text-center'>
              <div className='text-3xl font-bold text-blue-600 mb-2'>0</div>
              <div className='text-sm text-gray-600'>Disease Scans</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
