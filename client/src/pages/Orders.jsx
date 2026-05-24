import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import PageLoader from '../components/PageLoader';
import { Package, ChevronRight } from 'lucide-react';
import axios from '../utils/axios';

const statusColors = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  shipped: 'bg-purple-100 text-purple-800 border-purple-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    axios
      .get('/api/marketplace/orders')
      .then((res) => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className='flex'>
        <Sidebar />
        <div className='flex-1'>
          <PageLoader label='Loading orders...' />
        </div>
      </div>
    );
  }

  return (
    <div className='flex'>
      <Sidebar />
      <div className='flex-1 p-8'>
        <h1 className='page-heading flex items-center gap-2 mb-8'>
          <Package className='h-8 w-8 text-primary-600' />
          My Orders
        </h1>

        {orders.length === 0 ? (
          <div className='card text-center py-16'>
            <p className='text-gray-500 mb-4'>No orders yet</p>
            <Link to='/marketplace' className='btn-primary inline-block'>
              Shop Marketplace
            </Link>
          </div>
        ) : (
          <div className='space-y-4'>
            {orders.map((order) => (
              <div key={order._id} className='card'>
                <button
                  type='button'
                  className='w-full flex items-center justify-between text-left'
                  onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                >
                  <div>
                    <p className='font-mono text-xs text-gray-500'>#{order._id.slice(-8).toUpperCase()}</p>
                    <p className='text-gray-900 font-semibold mt-1'>
                      ₹{order.totalAmount} · {order.items?.length} item(s)
                    </p>
                    <p className='text-xs text-gray-500 mt-1'>
                      {new Date(order.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border capitalize ${statusColors[order.status]}`}
                    >
                      {order.status}
                    </span>
                    <ChevronRight
                      className={`h-5 w-5 text-gray-400 transition-transform ${
                        expanded === order._id ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                </button>
                {expanded === order._id && (
                  <div className='mt-4 pt-4 border-t border-gray-200 space-y-2'>
                    <p className='text-sm text-gray-600'>
                      <strong className='text-gray-900'>Address:</strong> {order.shippingAddress}
                    </p>
                    <p className='text-sm text-gray-600'>
                      <strong className='text-gray-900'>Payment:</strong> {order.paymentMethod}
                    </p>
                    <ul className='mt-3 space-y-2'>
                      {order.items?.map((item, idx) => (
                        <li key={idx} className='flex justify-between text-sm bg-gray-50 p-2 rounded-lg'>
                          <span className='text-gray-700'>
                            {item.name} × {item.quantity}
                          </span>
                          <span className='text-primary-700 font-medium'>₹{item.price * item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                    <div className='mt-4 flex gap-2 flex-wrap'>
                      {['pending', 'confirmed', 'shipped', 'delivered'].map((step, i) => {
                        const steps = ['pending', 'confirmed', 'shipped', 'delivered'];
                        const currentIdx = steps.indexOf(order.status);
                        const done = i <= currentIdx;
                        return (
                          <div
                            key={step}
                            className={`flex-1 min-w-[4rem] text-center py-2 rounded-lg text-xs capitalize border ${
                              done
                                ? 'border-primary-300 bg-primary-50 text-primary-800'
                                : 'border-gray-200 text-gray-400 bg-gray-50'
                            }`}
                          >
                            {step}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
