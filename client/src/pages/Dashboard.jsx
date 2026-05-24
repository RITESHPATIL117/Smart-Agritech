import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import {
  LayoutDashboard,
  Sprout,
  FlaskConical,
  CloudSun,
  Stethoscope,
  Activity,
  Store,
} from 'lucide-react';
import axios from '../utils/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { AnimatedSection, StaggerItem } from '../components/Animated';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const typeLabels = {
  crop: 'Crop Recommendation',
  fertilizer: 'Fertilizer Suggestion',
  disease: 'Disease Detection',
};

const formatRelativeTime = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/users/history');
      const data = response.data;
      setHistory(data);
      setStats({
        totalRecommendations: data.length,
        cropRecommendations: data.filter((r) => r.type === 'crop').length,
        fertilizerRecommendations: data.filter((r) => r.type === 'fertilizer').length,
        diseaseDetections: data.filter((r) => r.type === 'disease').length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: Store, label: 'Marketplace', path: '/marketplace', color: 'bg-cyan-500' },
    { icon: Sprout, label: 'Crop Recommendation', path: '/crop-recommendation', color: 'bg-green-500' },
    { icon: FlaskConical, label: 'Fertilizer Suggestion', path: '/fertilizer-recommendation', color: 'bg-blue-500' },
    { icon: CloudSun, label: 'Weather Check', path: '/weather', color: 'bg-yellow-500' },
    { icon: Stethoscope, label: 'Disease Detection', path: '/disease-detection', color: 'bg-red-500' },
  ];

  const chartData = [
    { name: 'Crop', value: stats?.cropRecommendations || 0, color: '#22c55e' },
    { name: 'Fertilizer', value: stats?.fertilizerRecommendations || 0, color: '#3b82f6' },
    { name: 'Disease', value: stats?.diseaseDetections || 0, color: '#ef4444' },
  ];

  const recentActivity = history.slice(0, 5).map((rec) => ({
    type: typeLabels[rec.type] || rec.type,
    date: formatRelativeTime(rec.createdAt),
    status: 'Completed',
  }));

  if (loading) {
    return (
      <div className='flex'>
        <Sidebar />
        <div className='flex-1 flex items-center justify-center min-h-[60vh]'>
          <LoadingSpinner size='lg' label='Syncing dashboard...' />
        </div>
      </div>
    );
  }

  return (
    <div className='flex'>
      <Sidebar />
      <div className='flex-1 p-8'>
        <div className='mb-8'>
          <h1 className='page-heading'>Welcome, {user?.name}</h1>
          <p className='page-subtext'>Your farming dashboard overview</p>
        </div>

        <AnimatedSection>
          <div className='bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 mb-8 text-white shadow-lg hover:shadow-xl transition-shadow duration-300'>
            <div className='flex items-center gap-4 mb-2'>
              <div className='bg-white/20 p-2 rounded-lg motion-safe:animate-pulse-soft'>
                <Activity className='h-6 w-6' />
              </div>
              <h2 className='text-2xl font-bold'>Powered by Google Gemini AI</h2>
            </div>
            <p className='text-primary-100 max-w-2xl'>
              Crop & fertilizer recommendations, disease detection, weather, and marketplace — all in one place.
            </p>
          </div>
        </AnimatedSection>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <StaggerItem index={0}>
          <div className='card-interactive'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Total Recommendations</p>
                <p className='text-3xl font-bold text-gray-900 mt-1'>{stats?.totalRecommendations || 0}</p>
              </div>
              <div className='bg-primary-100 p-3 rounded-lg'>
                <LayoutDashboard className='h-6 w-6 text-primary-600' />
              </div>
            </div>
          </div>
          </StaggerItem>
          <StaggerItem index={1}>
          <div className='card-interactive'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>AI Crop Suggestions</p>
                <p className='text-3xl font-bold text-gray-900 mt-1'>{stats?.cropRecommendations || 0}</p>
              </div>
              <div className='bg-green-100 p-3 rounded-lg'>
                <Sprout className='h-6 w-6 text-green-600' />
              </div>
            </div>
          </div>
          </StaggerItem>
          <StaggerItem index={2}>
          <div className='card-interactive'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>AI Fertilizer Tips</p>
                <p className='text-3xl font-bold text-gray-900 mt-1'>{stats?.fertilizerRecommendations || 0}</p>
              </div>
              <div className='bg-blue-100 p-3 rounded-lg'>
                <FlaskConical className='h-6 w-6 text-blue-600' />
              </div>
            </div>
          </div>
          </StaggerItem>
          <StaggerItem index={3}>
          <div className='card-interactive'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>AI Disease Scans</p>
                <p className='text-3xl font-bold text-gray-900 mt-1'>{stats?.diseaseDetections || 0}</p>
              </div>
              <div className='bg-red-100 p-3 rounded-lg'>
                <Stethoscope className='h-6 w-6 text-red-600' />
              </div>
            </div>
          </div>
          </StaggerItem>
        </div>

        <AnimatedSection delay={100}>
        <div className='mb-8'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>Quick Actions</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <StaggerItem key={action.path} index={index}>
                <Link
                  to={action.path}
                  className='card-interactive cursor-pointer block group'
                >
                  <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className='h-6 w-6 text-white' />
                  </div>
                  <h3 className='font-semibold text-gray-900'>{action.label}</h3>
                </Link>
                </StaggerItem>
              );
            })}
          </div>
        </div>
        </AnimatedSection>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
          <div className='card'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Recommendations Overview</h3>
            <ResponsiveContainer width='100%' height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey='value' fill='#22c55e' />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className='card'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Distribution</h3>
            <ResponsiveContainer width='100%' height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  dataKey='value'
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className='card'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>Recent Activity</h3>
          {recentActivity.length > 0 ? (
            <div className='space-y-3'>
              {recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between py-3 border-b border-gray-100 last:border-0'
                >
                  <div className='flex items-center space-x-3'>
                    <Activity className='h-5 w-5 text-primary-600' />
                    <div>
                      <p className='font-medium text-gray-900'>{activity.type}</p>
                      <p className='text-sm text-gray-500'>{activity.date}</p>
                    </div>
                  </div>
                  <span className='text-sm text-green-600 font-medium'>{activity.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-500 text-sm py-4'>
              No activity yet. Try crop recommendation or disease detection to see history here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
