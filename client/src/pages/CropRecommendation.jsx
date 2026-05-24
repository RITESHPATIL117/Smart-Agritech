import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Sprout, Thermometer, Droplets, Gauge, Activity } from 'lucide-react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import AiDisclaimer from '../components/AiDisclaimer';
import LoadingSpinner from '../components/LoadingSpinner';

const CropRecommendation = () => {
  const [formData, setFormData] = useState({
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: '',
  });
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/crops/recommend', {
        nitrogen: Number(formData.nitrogen),
        phosphorus: Number(formData.phosphorus),
        potassium: Number(formData.potassium),
        temperature: Number(formData.temperature),
        humidity: Number(formData.humidity),
        ph: Number(formData.ph),
        rainfall: Number(formData.rainfall),
      });

      setRecommendations(response.data);
      toast.success('Recommendations generated successfully!');
    } catch (error) {
      toast.error('Failed to generate recommendations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex'>
      <Sidebar />
      <div className='flex-1 p-8'>
        <div className='mb-8'>
          <h1 className='page-heading'>Neural Crop Engine</h1>
          <p className='page-subtext'>AI-powered crop selection from soil & climate vectors</p>
        </div>
        <AiDisclaimer />

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='card'>
            <h2 className='text-xl font-semibold text-gray-900 mb-6'>Enter Soil & Climate Data</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Nitrogen (N)</label>
                  <input
                    type='number'
                    name='nitrogen'
                    value={formData.nitrogen}
                    onChange={handleChange}
                    className='input-field'
                    placeholder='0-140'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Phosphorus (P)</label>
                  <input
                    type='number'
                    name='phosphorus'
                    value={formData.phosphorus}
                    onChange={handleChange}
                    className='input-field'
                    placeholder='5-145'
                    required
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Potassium (K)</label>
                  <input
                    type='number'
                    name='potassium'
                    value={formData.potassium}
                    onChange={handleChange}
                    className='input-field'
                    placeholder='5-205'
                    required
                  />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Temperature (C)</label>
                  <div className='relative'>
                    <Thermometer className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                    <input
                      type='number'
                      name='temperature'
                      value={formData.temperature}
                      onChange={handleChange}
                      className='input-field pl-10'
                      placeholder='0-50'
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Humidity (%)</label>
                  <div className='relative'>
                    <Droplets className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                    <input
                      type='number'
                      name='humidity'
                      value={formData.humidity}
                      onChange={handleChange}
                      className='input-field pl-10'
                      placeholder='0-100'
                      required
                    />
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>pH Level</label>
                  <div className='relative'>
                    <Gauge className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                    <input
                      type='number'
                      name='ph'
                      value={formData.ph}
                      onChange={handleChange}
                      className='input-field pl-10'
                      placeholder='0-14'
                      step='0.1'
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Rainfall (mm)</label>
                  <div className='relative'>
                    <Activity className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                    <input
                      type='number'
                      name='rainfall'
                      value={formData.rainfall}
                      onChange={handleChange}
                      className='input-field pl-10'
                      placeholder='0-300'
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type='submit'
                disabled={loading}
                className='w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50'
              >
                {loading ? 'Analyzing...' : 'Get Recommendations'}
              </button>
            </form>
          </div>

          <div className='card'>
            <h2 className='text-xl font-semibold text-gray-900 mb-6'>Recommended Crops</h2>
            {loading ? (
              <LoadingSpinner label='Neural analysis in progress...' />
            ) : recommendations.length > 0 ? (
              <div className='space-y-4'>
                {recommendations.map((crop, index) => (
                  <div key={index} className='border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors'>
                    <div className='flex items-start justify-between'>
                      <div className='flex items-center space-x-3'>
                        <div className='bg-green-100 p-2 rounded-lg'>
                          <Sprout className='h-6 w-6 text-green-600' />
                        </div>
                        <div>
                          <h3 className='font-semibold text-gray-900'>{crop.name}</h3>
                          <p className='text-sm text-gray-500'>{crop.season} Season</p>
                        </div>
                      </div>
                      <span className='bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded'>
                        #{index + 1}
                      </span>
                    </div>
                    <div className='mt-3 grid grid-cols-2 gap-2 text-sm'>
                      <div>
                        <span className='text-gray-500'>Temperature:</span>{' '}
                        <span className='font-medium'>{crop.temperature.min}-{crop.temperature.max}C</span>
                      </div>
                      <div>
                        <span className='text-gray-500'>pH:</span>{' '}
                        <span className='font-medium'>{crop.ph.min}-{crop.ph.max}</span>
                      </div>
                      <div>
                        <span className='text-gray-500'>Rainfall:</span>{' '}
                        <span className='font-medium'>{crop.rainfall.min}-{crop.rainfall.max}mm</span>
                      </div>
                      <div>
                        <span className='text-gray-500'>Yield:</span>{' '}
                        <span className='font-medium'>{crop.yield}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-12 text-gray-500'>
                <Sprout className='h-12 w-12 mx-auto mb-4 text-gray-300' />
                <p>Enter your soil and climate data to get crop recommendations</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropRecommendation;
