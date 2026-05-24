import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
  History as HistoryIcon,
  Sprout,
  FlaskConical,
  Stethoscope,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import axios from '../utils/axios';

const typeConfig = {
  crop: { label: 'Crop', icon: Sprout, color: 'bg-green-100 text-green-800', path: '/crop-recommendation' },
  fertilizer: {
    label: 'Fertilizer',
    icon: FlaskConical,
    color: 'bg-purple-100 text-purple-800',
    path: '/fertilizer-recommendation',
  },
  disease: {
    label: 'Disease',
    icon: Stethoscope,
    color: 'bg-red-100 text-red-800',
    path: '/disease-detection',
  },
};

const summarizeResult = (type, result) => {
  if (!result) return '—';
  if (type === 'fertilizer' && Array.isArray(result)) {
    return result.map((f) => f.name).join(', ') || '—';
  }
  if (type === 'crop' && Array.isArray(result)) {
    return result.map((c) => c.name).join(', ') || '—';
  }
  if (type === 'disease') {
    return (result.disease || result)?.name || '—';
  }
  return 'View details';
};

const History = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get('/api/users/history?limit=100');
        setItems(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered =
    filter === 'all' ? items : items.filter((i) => i.type === filter);

  return (
    <div className='flex'>
      <Sidebar />
      <div className='flex-1 p-8'>
        <div className='mb-8'>
          <h1 className='page-heading flex items-center gap-2'>
            <HistoryIcon className='h-8 w-8 text-primary-600' />
            My Activity History
          </h1>
          <p className='page-subtext'>
            All your AI crop, fertilizer, and disease recommendations in one place.
          </p>
        </div>

        <div className='flex flex-wrap gap-2 mb-6'>
          {['all', 'crop', 'fertilizer', 'disease'].map((f) => (
            <button
              key={f}
              type='button'
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                filter === f
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>

        {loading ? (
          <p className='text-gray-500'>Loading history...</p>
        ) : filtered.length === 0 ? (
          <div className='card text-center py-12'>
            <p className='text-gray-600 mb-4'>No records yet for this filter.</p>
            <Link to='/crop-recommendation' className='btn-primary inline-block'>
              Get your first recommendation
            </Link>
          </div>
        ) : (
          <div className='space-y-4'>
            {filtered.map((rec) => {
              const cfg = typeConfig[rec.type];
              const Icon = cfg.icon;
              const open = expandedId === rec._id;
              return (
                <div key={rec._id} className='card'>
                  <button
                    type='button'
                    className='w-full text-left flex items-start justify-between gap-4'
                    onClick={() => setExpandedId(open ? null : rec._id)}
                  >
                    <div className='flex items-start gap-3'>
                      <span className={`p-2 rounded-lg ${cfg.color}`}>
                        <Icon className='h-5 w-5' />
                      </span>
                      <div>
                        <p className='font-semibold text-gray-900'>{cfg.label} recommendation</p>
                        <p className='text-sm text-gray-600 mt-1'>
                          {summarizeResult(rec.type, rec.result)}
                        </p>
                        <p className='text-xs text-gray-400 mt-1'>
                          {new Date(rec.createdAt).toLocaleString('en-IN')} · Confidence{' '}
                          {rec.confidence ?? 0}%
                        </p>
                      </div>
                    </div>
                    {open ? (
                      <ChevronUp className='h-5 w-5 text-gray-400 flex-shrink-0' />
                    ) : (
                      <ChevronDown className='h-5 w-5 text-gray-400 flex-shrink-0' />
                    )}
                  </button>
                  {open && (
                    <div className='mt-4 pt-4 border-t border-gray-100 grid md:grid-cols-2 gap-4'>
                      <div>
                        <h4 className='text-sm font-semibold text-gray-700 mb-2'>Your input</h4>
                        <pre className='text-xs bg-gray-50 p-3 rounded-lg overflow-x-auto'>
                          {JSON.stringify(rec.inputData, null, 2)}
                        </pre>
                      </div>
                      <div>
                        <h4 className='text-sm font-semibold text-gray-700 mb-2'>AI result</h4>
                        <pre className='text-xs bg-gray-50 p-3 rounded-lg overflow-x-auto max-h-64'>
                          {JSON.stringify(rec.result, null, 2)}
                        </pre>
                      </div>
                      <div className='md:col-span-2'>
                        <Link to={cfg.path} className='text-sm text-primary-600 hover:underline'>
                          Run again →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
