import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState(user?.location || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const placeOrder = async () => {
    if (items.length === 0) return;
    if (!address.trim()) {
      toast.error('Enter shipping address');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/marketplace/orders', {
        items: items.map((i) => ({ productId: i._id, quantity: i.quantity })),
        shippingAddress: address,
        phone,
        paymentMethod: 'COD',
      });
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='flex'>
        <Sidebar />
        <div className='flex-1 p-8'>
          <LoadingSpinner size='lg' label='Processing order...' />
        </div>
      </div>
    );
  }

  return (
    <div className='flex'>
      <Sidebar />
      <div className='flex-1 p-8'>
        <h1 className='page-heading flex items-center gap-2 mb-8'>
          <ShoppingBag className='h-8 w-8 text-primary-600' />
          Cart
        </h1>

        {items.length === 0 ? (
          <div className='card text-center py-16'>
            <p className='text-gray-500 mb-4'>Your cart is empty</p>
            <Link to='/marketplace' className='btn-primary inline-flex items-center gap-2'>
              Browse Marketplace <ArrowRight className='h-4 w-4' />
            </Link>
          </div>
        ) : (
          <div className='grid lg:grid-cols-3 gap-8'>
            <div className='lg:col-span-2 space-y-4'>
              {items.map((item) => (
                <div key={item._id} className='card flex gap-4'>
                  <div className='text-4xl w-16 h-16 flex items-center justify-center bg-gray-50 rounded-xl'>
                    {item.image}
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-semibold text-gray-900'>{item.name}</h3>
                    <p className='text-primary-700 font-bold mt-1'>
                      ₹{item.price} <span className='text-xs text-gray-500 font-normal'>{item.unit}</span>
                    </p>
                    <div className='flex items-center gap-3 mt-3'>
                      <button
                        type='button'
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className='p-1 rounded border border-gray-300 hover:bg-gray-50'
                      >
                        <Minus className='h-4 w-4' />
                      </button>
                      <span className='text-gray-900 w-8 text-center'>{item.quantity}</span>
                      <button
                        type='button'
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className='p-1 rounded border border-gray-300 hover:bg-gray-50'
                      >
                        <Plus className='h-4 w-4' />
                      </button>
                      <button
                        type='button'
                        onClick={() => removeFromCart(item._id)}
                        className='ml-auto text-red-600 hover:text-red-700'
                      >
                        <Trash2 className='h-5 w-5' />
                      </button>
                    </div>
                  </div>
                  <p className='text-gray-900 font-semibold'>₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
            <div className='card h-fit border-primary-200'>
              <h2 className='font-semibold text-gray-900 mb-4'>Checkout</h2>
              <div className='space-y-4 mb-6'>
                <div>
                  <label className='block text-sm text-gray-600 mb-1'>Shipping address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className='input-field'
                    rows={3}
                    placeholder='Village, district, state, PIN'
                  />
                </div>
                <div>
                  <label className='block text-sm text-gray-600 mb-1'>Phone</label>
                  <input
                    type='tel'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className='input-field'
                  />
                </div>
                <p className='text-sm text-gray-500'>Payment: Cash on Delivery (COD)</p>
              </div>
              <div className='border-t border-gray-200 pt-4 mb-4'>
                <div className='flex justify-between text-lg'>
                  <span className='text-gray-600'>Total</span>
                  <span className='font-bold text-primary-700'>₹{cartTotal}</span>
                </div>
              </div>
              <button type='button' onClick={placeOrder} className='w-full btn-primary py-3'>
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
