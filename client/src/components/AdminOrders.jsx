import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';
import PageLoader from './PageLoader';

const statuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/admin/orders');
      setOrders(res.data);
    } catch (e) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`/api/admin/orders/${id}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (e) {
      toast.error('Update failed');
    }
  };

  if (loading) return <PageLoader label='Loading orders...' />;

  return (
    <div className='card mt-8'>
      <h3 className='text-lg font-semibold text-gray-900 mb-2'>Marketplace Orders</h3>
      <p className='text-sm text-gray-500 mb-6'>Manage farmer orders and delivery status</p>
      {orders.length === 0 ? (
        <p className='text-gray-500 text-center py-8'>No orders yet</p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[700px] text-sm'>
            <thead>
              <tr className='border-b border-gray-200 text-gray-600'>
                <th className='text-left py-2 px-2'>Order</th>
                <th className='text-left py-2 px-2'>Farmer</th>
                <th className='text-left py-2 px-2'>Total</th>
                <th className='text-left py-2 px-2'>Status</th>
                <th className='text-left py-2 px-2'>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className='border-b border-gray-100'>
                  <td className='py-3 px-2 font-mono text-xs text-gray-500'>#{o._id.slice(-6)}</td>
                  <td className='py-3 px-2 text-gray-900'>{o.user?.name}</td>
                  <td className='py-3 px-2 text-primary-700 font-medium'>₹{o.totalAmount}</td>
                  <td className='py-3 px-2'>
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o._id, e.target.value)}
                      className='input-field py-1 text-xs'
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className='py-3 px-2 text-gray-500 text-xs'>
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
