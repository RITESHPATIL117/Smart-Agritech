import { useEffect, useState } from 'react';
import { Mail, MailOpen } from 'lucide-react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

const AdminContacts = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/contacts');
      setMessages(res.data);
    } catch (e) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markRead = async (id) => {
    try {
      await axios.patch(`/api/admin/contacts/${id}/read`);
      fetchMessages();
      toast.success('Marked as read');
    } catch (e) {
      toast.error('Failed to update');
    }
  };

  return (
    <div className='card mt-8'>
      <h3 className='text-lg font-semibold text-gray-900 mb-2'>Contact Messages</h3>
      <p className='text-sm text-gray-500 mb-6'>Inquiries from the public contact form.</p>

      {loading ? (
        <p className='text-gray-500 py-8 text-center'>Loading...</p>
      ) : messages.length === 0 ? (
        <p className='text-gray-500 py-8 text-center'>No messages yet.</p>
      ) : (
        <div className='space-y-4'>
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`border rounded-lg p-4 ${
                msg.status === 'new' ? 'border-primary-200 bg-primary-50/30' : 'border-gray-200'
              }`}
            >
              <div className='flex justify-between items-start gap-4'>
                <div>
                  <p className='font-semibold text-gray-900'>{msg.subject}</p>
                  <p className='text-sm text-gray-600'>
                    {msg.name} · {msg.email}
                  </p>
                  <p className='text-xs text-gray-400 mt-1'>
                    {new Date(msg.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
                {msg.status === 'new' && (
                  <button
                    type='button'
                    onClick={() => markRead(msg._id)}
                    className='flex items-center gap-1 text-sm text-primary-600 hover:bg-primary-50 px-2 py-1 rounded'
                  >
                    <MailOpen className='h-4 w-4' />
                    Mark read
                  </button>
                )}
                {msg.status === 'read' && (
                  <span className='text-xs text-gray-500 flex items-center gap-1'>
                    <Mail className='h-4 w-4' /> Read
                  </span>
                )}
              </div>
              <p className='mt-3 text-sm text-gray-700 whitespace-pre-wrap'>{msg.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
