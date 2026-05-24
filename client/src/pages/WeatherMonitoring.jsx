import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { CloudSun, Search, Thermometer, Droplets, Wind, Gauge, Calendar } from 'lucide-react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

const WeatherMonitoring = () => {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setForecast([]);

    try {
      const [currentRes, forecastRes] = await Promise.all([
        axios.get(`/api/weather/${encodeURIComponent(city.trim())}`),
        axios.get(`/api/weather/forecast/${encodeURIComponent(city.trim())}`),
      ]);
      setWeatherData(currentRes.data);
      setForecast(forecastRes.data);
      toast.success('Weather data fetched successfully!');
    } catch (error) {
      toast.error('Failed to fetch weather data. Please check the city name.');
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
          <h1 className='page-heading'>Weather Intelligence</h1>
          <p className='page-subtext'>
            Hyperlocal forecast & AI farming advisories
          </p>
        </div>

        <div className='card mb-8'>
          <form onSubmit={handleSearch} className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
              <input
                type='text'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className='input-field pl-10'
                placeholder='Enter city name (e.g., Delhi, Mumbai, Pune)'
              />
            </div>
            <button type='submit' disabled={loading} className='btn-primary px-8 disabled:opacity-50'>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {weatherData && (
          <>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
              <div className='card bg-gradient-to-br from-blue-500 to-blue-600 text-white'>
                <div className='flex items-center justify-between mb-6'>
                  <div>
                    <h2 className='text-3xl font-bold'>{weatherData.city}</h2>
                    <p className='text-blue-100'>{weatherData.country}</p>
                  </div>
                  <div className='text-right'>
                    <div className='text-5xl font-bold'>{Math.round(weatherData.temperature)}°C</div>
                    <p className='text-blue-100 capitalize'>{weatherData.description}</p>
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-4 mt-8'>
                  <div className='bg-white/20 rounded-lg p-4'>
                    <div className='flex items-center space-x-2 mb-2'>
                      <Thermometer className='h-5 w-5' />
                      <span className='text-sm'>Feels Like</span>
                    </div>
                    <p className='text-2xl font-semibold'>{Math.round(weatherData.feelsLike)}°C</p>
                  </div>
                  <div className='bg-white/20 rounded-lg p-4'>
                    <div className='flex items-center space-x-2 mb-2'>
                      <Droplets className='h-5 w-5' />
                      <span className='text-sm'>Humidity</span>
                    </div>
                    <p className='text-2xl font-semibold'>{weatherData.humidity}%</p>
                  </div>
                  <div className='bg-white/20 rounded-lg p-4'>
                    <div className='flex items-center space-x-2 mb-2'>
                      <Wind className='h-5 w-5' />
                      <span className='text-sm'>Wind Speed</span>
                    </div>
                    <p className='text-2xl font-semibold'>{weatherData.windSpeed} m/s</p>
                  </div>
                  <div className='bg-white/20 rounded-lg p-4'>
                    <div className='flex items-center space-x-2 mb-2'>
                      <Gauge className='h-5 w-5' />
                      <span className='text-sm'>Pressure</span>
                    </div>
                    <p className='text-2xl font-semibold'>{weatherData.pressure} hPa</p>
                  </div>
                </div>
              </div>

              <div className='card'>
                <h3 className='text-xl font-semibold text-gray-900 mb-4'>Farming Recommendations</h3>
                <div className='space-y-4'>
                  <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                    <h4 className='font-semibold text-green-800 mb-2'>Irrigation</h4>
                    <p className='text-sm text-green-700'>
                      {weatherData.humidity < 40
                        ? 'Low humidity — consider increasing irrigation.'
                        : weatherData.humidity > 70
                          ? 'High humidity — reduce irrigation to prevent waterlogging.'
                          : 'Humidity is optimal. Maintain regular irrigation.'}
                    </p>
                  </div>
                  <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                    <h4 className='font-semibold text-yellow-800 mb-2'>Temperature</h4>
                    <p className='text-sm text-yellow-700'>
                      {weatherData.temperature > 35
                        ? 'High temperature — provide shade and extra water.'
                        : weatherData.temperature < 15
                          ? 'Low temperature — consider frost protection.'
                          : 'Temperature is favorable for most crops.'}
                    </p>
                  </div>
                  <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                    <h4 className='font-semibold text-blue-800 mb-2'>Wind</h4>
                    <p className='text-sm text-blue-700'>
                      {weatherData.windSpeed > 10
                        ? 'Strong winds — secure equipment and materials.'
                        : 'Wind conditions are normal for field work.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {forecast.length > 0 && (
              <div className='card'>
                <div className='flex items-center space-x-2 mb-4'>
                  <Calendar className='h-5 w-5 text-primary-600' />
                  <h3 className='text-xl font-semibold text-gray-900'>24–48 Hour Forecast</h3>
                </div>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                  {forecast.map((slot, index) => (
                    <div key={index} className='bg-gray-50 rounded-lg p-4 text-center border border-gray-100'>
                      <p className='text-xs text-gray-500 mb-1'>
                        {new Date(slot.dateTime * 1000).toLocaleString('en-IN', {
                          weekday: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className='text-2xl font-bold text-gray-900'>{Math.round(slot.temperature)}°C</p>
                      <p className='text-sm text-gray-600 capitalize mt-1'>{slot.description}</p>
                      <p className='text-xs text-gray-500 mt-1'>Humidity {slot.humidity}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!weatherData && !loading && (
          <div className='card text-center py-12'>
            <CloudSun className='h-16 w-16 mx-auto mb-4 text-gray-300' />
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>Search for Weather Data</h3>
            <p className='text-gray-500'>
              Enter a city name for current conditions, forecast, and farming tips.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherMonitoring;
