import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { 
  Users, 
  Sprout, 
  FlaskConical, 
  Stethoscope, 
  Activity,
  TrendingUp,
  BarChart3,
  Trash2,
  Shield,
  RefreshCw
} from 'lucide-react';
import axios from '../utils/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import toast from 'react-hot-toast';
import AdminLeads from '../components/AdminLeads';
import AdminContacts from '../components/AdminContacts';
import AdminOrders from '../components/AdminOrders';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAdminStats();
    // Real-time polling every 30 seconds
    const interval = setInterval(fetchAdminStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAdminStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await axios.delete(`/api/admin/users/${userId}`);
      toast.success('User deleted successfully');
      fetchAdminStats();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleToggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'farmer' : 'admin';
    try {
      await axios.put(`/api/admin/users/${userId}/role`, { role: newRole });
      toast.success('User role updated successfully');
      fetchAdminStats();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Activity className='h-8 w-8 animate-spin text-primary-600' />
      </div>
    );
  }

  const userGrowthData =
    stats?.userGrowthData?.length > 0
      ? stats.userGrowthData
      : [{ month: 'Users', users: stats?.stats?.users || 0 }];

  const activityData = stats?.activityBreakdown || [];
  const allUsers = stats?.allUsers || stats?.recentUsers || [];

  return (
    <div className='flex min-h-screen'>
      <Sidebar />
      <div className='flex-1 p-8 overflow-y-auto'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex items-center justify-between mb-8'>
            <div>
              <h1 className='page-heading'>Admin Dashboard</h1>
              <p className='page-subtext'>Platform stats, leads & user management</p>
            </div>
            <button 
              onClick={fetchAdminStats}
              className='flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-200 transition-colors'
            >
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>
          </div>

          <div className='flex flex-wrap gap-2 mb-8 border-b border-gray-200'>
            {['overview', 'leads', 'messages', 'orders'].map((tab) => (
              <button
                key={tab}
                type='button'
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors capitalize flex items-center gap-2 ${
                  activeTab === tab
                    ? 'border-primary-600 text-primary-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
                {tab === 'messages' && (stats?.stats?.newMessages || 0) > 0 && (
                  <span className='bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full'>
                    {stats.stats.newMessages}
                  </span>
                )}
              </button>
            ))}
          </div>

        {activeTab === 'overview' && (
          <>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8'>
          <div className='card'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Total Users</p>
                <p className='text-3xl font-bold text-gray-900 mt-1'>{stats?.stats?.users || 0}</p>
              </div>
              <div className='bg-blue-100 p-3 rounded-lg'>
                <Users className='h-6 w-6 text-blue-600' />
              </div>
            </div>
          </div>

          <div className='card'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Crops</p>
                <p className='text-3xl font-bold text-gray-900 mt-1'>{stats?.stats?.crops || 0}</p>
              </div>
              <div className='bg-green-100 p-3 rounded-lg'>
                <Sprout className='h-6 w-6 text-green-600' />
              </div>
            </div>
          </div>

          <div className='card'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Fertilizers</p>
                <p className='text-3xl font-bold text-gray-900 mt-1'>{stats?.stats?.fertilizers || 0}</p>
              </div>
              <div className='bg-purple-100 p-3 rounded-lg'>
                <FlaskConical className='h-6 w-6 text-purple-600' />
              </div>
            </div>
          </div>

          <div className='card'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Diseases</p>
                <p className='text-3xl font-bold text-gray-900 mt-1'>{stats?.stats?.diseases || 0}</p>
              </div>
              <div className='bg-red-100 p-3 rounded-lg'>
                <Stethoscope className='h-6 w-6 text-red-600' />
              </div>
            </div>
          </div>

          <div className='card'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm'>Recommendations</p>
                <p className='text-3xl font-bold text-gray-900 mt-1'>{stats?.stats?.recommendations || 0}</p>
              </div>
              <div className='bg-yellow-100 p-3 rounded-lg'>
                <Activity className='h-6 w-6 text-yellow-600' />
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
          <div className='card'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>User Growth</h3>
            <ResponsiveContainer width='100%' height={250}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip />
                <Line type='monotone' dataKey='users' stroke='#22c55e' strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className='card'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>AI Usage by Feature</h3>
            <ResponsiveContainer width='100%' height={250}>
              <BarChart data={activityData.length > 0 ? activityData : [
                { name: 'Crop', value: 0 },
                { name: 'Fertilizer', value: 0 },
                { name: 'Disease', value: 0 },
              ]}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='value' fill='#3b82f6' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='card'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Recent Users</h3>
            <div className='space-y-3'>
              {stats?.recentUsers?.map((user) => (
                <div key={user._id} className='flex items-center justify-between py-3 border-b border-gray-100 last:border-0'>
                  <div className='flex items-center space-x-3'>
                    <div className='bg-primary-100 p-2 rounded-full'>
                      <Users className='h-4 w-4 text-primary-600' />
                    </div>
                    <div>
                      <p className='font-medium text-gray-900'>{user.name}</p>
                      <p className='text-sm text-gray-500'>{user.email}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className='card'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>Recent Recommendations</h3>
            <div className='space-y-3'>
              {stats?.recentRecommendations?.map((rec) => (
                <div key={rec._id} className='flex items-center justify-between py-3 border-b border-gray-100 last:border-0'>
                  <div className='flex items-center space-x-3'>
                    <div className='bg-blue-100 p-2 rounded-full'>
                      <Activity className='h-4 w-4 text-blue-600' />
                    </div>
                    <div>
                      <p className='font-medium text-gray-900 capitalize'>{rec.type} Recommendation</p>
                      <p className='text-sm text-gray-500'>{rec.user?.name || 'Unknown'}</p>
                    </div>
                  </div>
                  <span className='text-xs text-gray-500'>
                    {new Date(rec.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='card mt-8 mb-8'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>User Management</h3>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-200'>
                  <th className='text-left py-3 px-4 font-semibold text-gray-700'>Name</th>
                  <th className='text-left py-3 px-4 font-semibold text-gray-700'>Email</th>
                  <th className='text-left py-3 px-4 font-semibold text-gray-700'>Role</th>
                  <th className='text-left py-3 px-4 font-semibold text-gray-700'>Location</th>
                  <th className='text-left py-3 px-4 font-semibold text-gray-700'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((user) => (
                  <tr key={user._id} className='border-b border-gray-100 hover:bg-gray-50'>
                    <td className='py-3 px-4'>{user.name}</td>
                    <td className='py-3 px-4 text-sm text-gray-600'>{user.email}</td>
                    <td className='py-3 px-4'>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className='py-3 px-4 text-sm text-gray-600'>{user.location || '-'}</td>
                    <td className='py-3 px-4'>
                      <div className='flex items-center space-x-2'>
                        <button
                          onClick={() => handleToggleRole(user._id, user.role)}
                          className='p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors'
                          title='Toggle Role'
                        >
                          <Shield className='h-4 w-4' />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                          title='Delete User'
                        >
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
          </>
        )}

        {activeTab === 'leads' && <AdminLeads />}
        {activeTab === 'messages' && <AdminContacts />}
        {activeTab === 'orders' && <AdminOrders />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
