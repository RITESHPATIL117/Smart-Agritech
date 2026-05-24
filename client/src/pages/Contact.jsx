import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Leaf } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from '../utils/axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

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
      await axios.post('/api/contact', formData);
      toast.success('Message sent successfully! We will respond soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen py-12 px-4 pb-24'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-12'>
          <div className='flex items-center justify-center space-x-2 mb-4'>
            <Leaf className='h-10 w-10 text-primary-600' />
            <h1 className='text-4xl font-bold text-gray-900'>Contact Us</h1>
          </div>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Have questions or need support? We're here to help. Reach out to us and we'll respond as soon as possible.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
          <div>
            <div className='card mb-8'>
              <h2 className='text-2xl font-semibold text-gray-900 mb-6'>Get in Touch</h2>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Your Name</label>
                  <input
                    type='text'
                    name='name'
                    value={formData.name}
                    onChange={handleChange}
                    className='input-field'
                    placeholder='John Doe'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    className='input-field'
                    placeholder='you@example.com'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Subject</label>
                  <input
                    type='text'
                    name='subject'
                    value={formData.subject}
                    onChange={handleChange}
                    className='input-field'
                    placeholder='How can we help?'
                    required
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Message</label>
                  <textarea
                    name='message'
                    value={formData.message}
                    onChange={handleChange}
                    rows='5'
                    className='input-field'
                    placeholder='Tell us more about your inquiry...'
                    required
                  ></textarea>
                </div>

                <button
                  type='submit'
                  disabled={loading}
                  className='w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50'
                >
                  {loading ? 'Sending...' : (
                    <>
                      <Send className='h-5 w-5' />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className='space-y-6'>
            <div className='card'>
              <h2 className='text-2xl font-semibold text-gray-900 mb-6'>Contact Information</h2>
              <div className='space-y-6'>
                <div className='flex items-start space-x-4'>
                  <div className='bg-primary-100 p-3 rounded-lg'>
                    <Mail className='h-6 w-6 text-primary-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-1'>Email</h3>
                    <p className='text-gray-600'>info@smartagritech.com</p>
                    <p className='text-gray-600'>support@smartagritech.com</p>
                  </div>
                </div>

                <div className='flex items-start space-x-4'>
                  <div className='bg-primary-100 p-3 rounded-lg'>
                    <Phone className='h-6 w-6 text-primary-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-1'>Phone</h3>
                    <p className='text-gray-600'>+91 1234567890</p>
                    <p className='text-gray-600'>+91 0987654321</p>
                  </div>
                </div>

                <div className='flex items-start space-x-4'>
                  <div className='bg-primary-100 p-3 rounded-lg'>
                    <MapPin className='h-6 w-6 text-primary-600' />
                  </div>
                  <div>
                    <h3 className='font-semibold text-gray-900 mb-1'>Address</h3>
                    <p className='text-gray-600'>
                      Smart AgriTech Office<br />
                      123 Agriculture Street<br />
                      New Delhi, India 110001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className='card bg-primary-600 text-white'>
              <h3 className='text-xl font-semibold mb-4'>Office Hours</h3>
              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span>Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className='flex justify-between'>
                  <span>Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className='flex justify-between'>
                  <span>Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>

            <div className='card'>
              <h3 className='text-xl font-semibold text-gray-900 mb-4'>Follow Us</h3>
              <div className='flex space-x-4'>
                <a href='#' className='bg-primary-100 text-primary-600 p-3 rounded-lg hover:bg-primary-200 transition-colors'>
                  <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z'/>
                  </svg>
                </a>
                <a href='#' className='bg-primary-100 text-primary-600 p-3 rounded-lg hover:bg-primary-200 transition-colors'>
                  <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'/>
                  </svg>
                </a>
                <a href='#' className='bg-primary-100 text-primary-600 p-3 rounded-lg hover:bg-primary-200 transition-colors'>
                  <svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24'>
                    <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z'/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
