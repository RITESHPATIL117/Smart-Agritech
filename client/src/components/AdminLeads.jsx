import { useEffect, useState, useMemo, Fragment } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  User,
  Sprout,
  FlaskConical,
  Stethoscope,
  Mail,
  Phone,
  MapPin,
  Download,
} from 'lucide-react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

const typeConfig = {
  crop: { label: 'Crop', icon: Sprout, color: 'bg-green-100 text-green-800' },
  fertilizer: { label: 'Fertilizer', icon: FlaskConical, color: 'bg-purple-100 text-purple-800' },
  disease: { label: 'Disease', icon: Stethoscope, color: 'bg-red-100 text-red-800' },
};

const formatInputSummary = (type, input) => {
  if (!input) return '—';
  if (type === 'fertilizer') {
    return `Crop: ${input.cropName || '—'} | Soil: ${input.soilType || '—'} | N: ${input.nitrogen ?? '—'}, P: ${input.phosphorus ?? '—'}, K: ${input.potassium ?? '—'}`;
  }
  if (type === 'crop') {
    return `N: ${input.nitrogen}, P: ${input.phosphorus}, K: ${input.potassium} | Temp: ${input.temperature}°C, Humidity: ${input.humidity}%, pH: ${input.ph}, Rain: ${input.rainfall}mm`;
  }
  if (type === 'disease') {
    return input.imageUrl ? `Plant image uploaded (${input.imageUrl})` : 'Plant image uploaded';
  }
  return JSON.stringify(input);
};

const formatResultSummary = (type, result) => {
  if (!result) return '—';
  if (type === 'fertilizer' && Array.isArray(result)) {
    if (result.length === 0) return 'No recommendations returned';
    return result
      .map((f, i) => `${i + 1}. ${f.name}${f.dosage ? ` (${f.dosage})` : ''}`)
      .join(' • ');
  }
  if (type === 'crop' && Array.isArray(result)) {
    if (result.length === 0) return 'No recommendations returned';
    return result.map((c, i) => `${i + 1}. ${c.name}${c.season ? ` — ${c.season}` : ''}`).join(' • ');
  }
  if (type === 'disease') {
    const d = result.disease || result;
    return `${d.name || 'Unknown'}${d.severity ? ` (${d.severity})` : ''}`;
  }
  return 'See details';
};

const AdminLeads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const params = typeFilter !== 'all' ? `?type=${typeFilter}` : '';
      const response = await axios.get(`/api/admin/leads${params}`);
      setLeads(response.data);
    } catch (error) {
      toast.error('Failed to load leads');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [typeFilter]);

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter((lead) => {
      const name = lead.user?.name?.toLowerCase() || '';
      const email = lead.user?.email?.toLowerCase() || '';
      const input = formatInputSummary(lead.type, lead.inputData).toLowerCase();
      const result = formatResultSummary(lead.type, lead.result).toLowerCase();
      return name.includes(q) || email.includes(q) || input.includes(q) || result.includes(q);
    });
  }, [leads, search]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const exportCsv = () => {
    const rows = filteredLeads.map((lead) => ({
      Date: new Date(lead.createdAt).toISOString(),
      User: lead.user?.name || '',
      Email: lead.user?.email || '',
      Phone: lead.user?.phone || '',
      Type: lead.type,
      Request: formatInputSummary(lead.type, lead.inputData),
      Recommendation: formatResultSummary(lead.type, lead.result),
      Confidence: lead.confidence ?? 0,
    }));
    if (rows.length === 0) {
      toast.error('No leads to export');
      return;
    }
    const headers = Object.keys(rows[0]);
    const escape = (v) => `"${String(v).replace(/"/g, '""')}"`;
    const csv = [
      headers.join(','),
      ...rows.map((r) => headers.map((h) => escape(r[h])).join(',')),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-agritech-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Leads exported');
  };

  return (
    <div className='card mt-8'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>Leads — User Recommendations</h3>
          <p className='text-sm text-gray-500 mt-1'>
            Every farmer request: what they asked, soil/crop inputs, and what AI recommended.
          </p>
        </div>
        <div className='flex flex-col sm:flex-row gap-3 flex-wrap'>
          <button
            type='button'
            onClick={exportCsv}
            className='flex items-center gap-2 btn-primary py-2 px-4 text-sm'
          >
            <Download className='h-4 w-4' />
            Export CSV
          </button>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
            <input
              type='text'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder='Search user, crop, fertilizer...'
              className='input-field pl-9 w-full sm:w-64'
            />
          </div>
          <div className='relative'>
            <Filter className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400' />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className='input-field pl-9 pr-8 appearance-none cursor-pointer'
            >
              <option value='all'>All types</option>
              <option value='fertilizer'>Fertilizer</option>
              <option value='crop'>Crop</option>
              <option value='disease'>Disease</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <p className='text-center text-gray-500 py-12'>Loading leads...</p>
      ) : filteredLeads.length === 0 ? (
        <p className='text-center text-gray-500 py-12'>
          No leads yet. Farmers need to use crop, fertilizer, or disease features.
        </p>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full min-w-[900px]'>
            <thead>
              <tr className='border-b border-gray-200 bg-gray-50'>
                <th className='text-left py-3 px-3 font-semibold text-gray-700 text-sm'>Date</th>
                <th className='text-left py-3 px-3 font-semibold text-gray-700 text-sm'>User</th>
                <th className='text-left py-3 px-3 font-semibold text-gray-700 text-sm'>Type</th>
                <th className='text-left py-3 px-3 font-semibold text-gray-700 text-sm'>What they asked</th>
                <th className='text-left py-3 px-3 font-semibold text-gray-700 text-sm'>AI recommended</th>
                <th className='text-left py-3 px-3 font-semibold text-gray-700 text-sm'>Confidence</th>
                <th className='text-left py-3 px-3 font-semibold text-gray-700 text-sm w-10'></th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => {
                const cfg = typeConfig[lead.type] || typeConfig.crop;
                const Icon = cfg.icon;
                const isOpen = expandedId === lead._id;

                return (
                  <Fragment key={lead._id}>
                    <tr
                      className='border-b border-gray-100 hover:bg-gray-50 cursor-pointer'
                      onClick={() => toggleExpand(lead._id)}
                    >
                      <td className='py-3 px-3 text-sm text-gray-600 whitespace-nowrap'>
                        {new Date(lead.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })}
                      </td>
                      <td className='py-3 px-3'>
                        <p className='font-medium text-gray-900 text-sm'>{lead.user?.name || 'Unknown'}</p>
                        <p className='text-xs text-gray-500'>{lead.user?.email || '—'}</p>
                      </td>
                      <td className='py-3 px-3'>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${cfg.color}`}
                        >
                          <Icon className='h-3 w-3' />
                          {cfg.label}
                        </span>
                      </td>
                      <td className='py-3 px-3 text-sm text-gray-700 max-w-xs'>
                        <p className='line-clamp-2'>{formatInputSummary(lead.type, lead.inputData)}</p>
                      </td>
                      <td className='py-3 px-3 text-sm text-gray-900 max-w-sm'>
                        <p className='line-clamp-2 font-medium'>{formatResultSummary(lead.type, lead.result)}</p>
                      </td>
                      <td className='py-3 px-3 text-sm'>
                        <span className='font-semibold text-primary-700'>{lead.confidence ?? 0}%</span>
                      </td>
                      <td className='py-3 px-3'>
                        {isOpen ? (
                          <ChevronUp className='h-4 w-4 text-gray-400' />
                        ) : (
                          <ChevronDown className='h-4 w-4 text-gray-400' />
                        )}
                      </td>
                    </tr>
                    {isOpen && (
                      <tr key={`${lead._id}-detail`} className='bg-primary-50/50'>
                        <td colSpan={7} className='py-4 px-4'>
                          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 text-sm'>
                            <div>
                              <h4 className='font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                                <User className='h-4 w-4' /> User details
                              </h4>
                              <ul className='space-y-2 text-gray-700'>
                                <li className='flex items-center gap-2'>
                                  <Mail className='h-4 w-4 text-gray-400' />
                                  {lead.user?.email || '—'}
                                </li>
                                <li className='flex items-center gap-2'>
                                  <Phone className='h-4 w-4 text-gray-400' />
                                  {lead.user?.phone || '—'}
                                </li>
                                <li className='flex items-center gap-2'>
                                  <MapPin className='h-4 w-4 text-gray-400' />
                                  {lead.user?.location || '—'}
                                  {lead.user?.farmSize ? ` · ${lead.user.farmSize} acres` : ''}
                                </li>
                              </ul>
                            </div>
                            <div>
                              <h4 className='font-semibold text-gray-900 mb-3'>Request (input)</h4>
                              <pre className='bg-white border border-gray-200 rounded-lg p-3 text-xs overflow-x-auto whitespace-pre-wrap'>
                                {JSON.stringify(lead.inputData, null, 2)}
                              </pre>
                            </div>
                            <div className='md:col-span-2'>
                              <h4 className='font-semibold text-gray-900 mb-3'>AI recommendation (full result)</h4>
                              {lead.type === 'fertilizer' && Array.isArray(lead.result) ? (
                                <div className='grid gap-3'>
                                  {lead.result.map((f, idx) => (
                                    <div
                                      key={idx}
                                      className='bg-white border border-gray-200 rounded-lg p-4'
                                    >
                                      <p className='font-semibold text-gray-900'>{f.name}</p>
                                      <p className='text-xs text-gray-500 mt-1'>
                                        {f.type} · NPK {f.nitrogen}-{f.phosphorus}-{f.potassium}
                                      </p>
                                      {f.dosage && (
                                        <p className='text-sm text-gray-700 mt-2'>
                                          <strong>Dosage:</strong> {f.dosage}
                                        </p>
                                      )}
                                      {f.applicationMethod && (
                                        <p className='text-sm text-gray-700'>
                                          <strong>Application:</strong> {f.applicationMethod}
                                        </p>
                                      )}
                                      {f.timing && (
                                        <p className='text-sm text-gray-700'>
                                          <strong>Timing:</strong> {f.timing}
                                        </p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : lead.type === 'crop' && Array.isArray(lead.result) ? (
                                <div className='grid gap-3 sm:grid-cols-3'>
                                  {lead.result.map((c, idx) => (
                                    <div
                                      key={idx}
                                      className='bg-white border border-gray-200 rounded-lg p-4'
                                    >
                                      <p className='font-semibold text-gray-900'>{c.name}</p>
                                      <p className='text-sm text-gray-600'>Season: {c.season || '—'}</p>
                                      {c.yield && (
                                        <p className='text-sm text-gray-600 mt-1'>Yield: {c.yield}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : lead.type === 'disease' ? (
                                <div className='bg-white border border-gray-200 rounded-lg p-4'>
                                  <p className='font-semibold text-lg'>
                                    {(lead.result?.disease || lead.result)?.name}
                                  </p>
                                  <p className='text-sm text-gray-600 italic'>
                                    {(lead.result?.disease || lead.result)?.scientificName}
                                  </p>
                                  <p className='mt-2 text-sm'>
                                    <strong>Treatment:</strong>{' '}
                                    {(lead.result?.disease || lead.result)?.treatment || '—'}
                                  </p>
                                  {lead.result?.imageUrl && (
                                    <p className='text-xs text-gray-500 mt-2'>
                                      Image: {lead.result.imageUrl}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <pre className='bg-white border border-gray-200 rounded-lg p-3 text-xs overflow-x-auto'>
                                  {JSON.stringify(lead.result, null, 2)}
                                </pre>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <p className='text-xs text-gray-500 mt-4'>
        Showing {filteredLeads.length} of {leads.length} lead(s)
      </p>
    </div>
  );
};

export default AdminLeads;
