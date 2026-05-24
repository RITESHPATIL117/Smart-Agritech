import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { FlaskConical, Leaf, Droplets } from 'lucide-react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import AiDisclaimer from '../components/AiDisclaimer';
import LoadingSpinner from '../components/LoadingSpinner';

const FertilizerRecommendation = () => {
  const [formData, setFormData] = useState({
    cropName: '',
    soilType: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
  });
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);

  const cropOptions = ['Wheat', 'Rice', 'Maize', 'Cotton', 'Sugarcane', 'Vegetables', 'Fruits'];
  const soilTypes = ['Loamy', 'Clay', 'Sandy', 'Black Soil', 'Red Soil', 'Alluvial'];

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
      const response = await axios.post('/api/fertilizers/recommend', {
        cropName: formData.cropName,
        soilType: formData.soilType,
        nitrogen: Number(formData.nitrogen),
        phosphorus: Number(formData.phosphorus),
        potassium: Number(formData.potassium),
      });

      setRecommendations(response.data);
      toast.success('Fertilizer recommendations generated successfully!');
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
          <h1 className='page-heading'>Fertilizer Intelligence</h1>
          <p className='page-subtext'>Precision nutrient recommendations for maximum yield</p>
        </div>
        <AiDisclaimer />

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='card'>
            <h2 className='text-xl font-semibold text-gray-900 mb-6'>Enter Crop & Soil Data</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Crop Name</label>
                <div className='relative'>
                  <Leaf className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                  <select
                    name='cropName'
                    value={formData.cropName}
                    onChange={handleChange}
                    className='input-field pl-10'
                    required
                  >
                    <option value=''>Select a crop</option>
                    {cropOptions.map((crop) => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Soil Type</label>
                <div className='relative'>
                  <Droplets className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                  <select
                    name='soilType'
                    value={formData.soilType}
                    onChange={handleChange}
                    className='input-field pl-10'
                    required
                  >
                    <option value=''>Select soil type</option>
                    {soilTypes.map((soil) => (
                      <option key={soil} value={soil}>{soil}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='grid grid-cols-3 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Nitrogen (N)</label>
                  <input
                    type='number'
                    name='nitrogen'
                    value={formData.nitrogen}
                    onChange={handleChange}
                    className='input-field'
                    placeholder='0-100'
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
                    placeholder='0-100'
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
                    placeholder='0-100'
                    required
                  />
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
            <h2 className='text-xl font-semibold text-gray-900 mb-6'>Recommended Fertilizers</h2>
            {loading ? (
              <LoadingSpinner label='Computing nutrient vectors...' />
            ) : recommendations.length > 0 ? (
              <div className='space-y-4'>
                {recommendations.map((fertilizer, index) => (
                  <div key={index} className='border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors'>
                    <div className='flex items-start justify-between'>
                      <div className='flex items-center space-x-3'>
                        <div className='bg-blue-100 p-2 rounded-lg'>
                          <FlaskConical className='h-6 w-6 text-blue-600' />
                        </div>
                        <div>
                          <h3 className='font-semibold text-gray-900'>{fertilizer.name}</h3>
                          <p className='text-sm text-gray-500'>{fertilizer.type}</p>
                        </div>
                      </div>
                      <span className='bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded'>
                        #{index + 1}
                      </span>
                    </div>
                    <div className='mt-3 grid grid-cols-3 gap-2 text-sm'>
                      <div>
                        <span className='text-gray-500'>N:</span>{' '}
                        <span className='font-medium'>{fertilizer.nitrogen}%</span>
                      </div>
                      <div>
                        <span className='text-gray-500'>P:</span>{' '}
                        <span className='font-medium'>{fertilizer.phosphorus}%</span>
                      </div>
                      <div>
                        <span className='text-gray-500'>K:</span>{' '}
                        <span className='font-medium'>{fertilizer.potassium}%</span>
                      </div>
                    </div>
                    <div className='mt-3 text-sm'>
                      <p className='text-gray-600'><span className='font-medium'>Dosage:</span> {fertilizer.dosage}</p>
                      <p className='text-gray-600'><span className='font-medium'>Timing:</span> {fertilizer.timing}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-12 text-gray-500'>
                <FlaskConical className='h-12 w-12 mx-auto mb-4 text-gray-300' />
                <p>Enter your crop and soil data to get fertilizer recommendations</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FertilizerRecommendation;
