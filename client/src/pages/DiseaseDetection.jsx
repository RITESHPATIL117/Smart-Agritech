import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import ScanLoader from '../components/ScanLoader';
import { Stethoscope, Upload, AlertCircle, CheckCircle, XCircle, FileDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

const DiseaseDetection = () => {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState('Initializing neural vision...');
  const progressRef = useRef(null);
  const [result, setResult] = useState(null);

  const scanMessages = [
    'Initializing neural vision...',
    'Extracting leaf patterns...',
    'Matching pathogen database...',
    'Running Gemini inference...',
    'Generating treatment plan...',
  ];

  useEffect(() => {
    if (!loading) {
      setScanProgress(0);
      return;
    }
    let step = 0;
    setScanMessage(scanMessages[0]);
    progressRef.current = setInterval(() => {
      step += 1;
      setScanProgress((p) => Math.min(p + 8, 92));
      setScanMessage(scanMessages[Math.min(step, scanMessages.length - 1)]);
    }, 600);
    return () => clearInterval(progressRef.current);
  }, [loading]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        toast.error('File size must be less than 5MB');
        return;
      }
      if (!file.type.match('image.*')) {
        toast.error('Please select an image file');
        return;
      }
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setLoading(true);
    setScanProgress(5);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('/api/diseases/detect', formData, {
        headers: { 'Content-Type': undefined },
        transformRequest: [(data) => data],
      });

      setScanProgress(100);
      setResult(response.data);
      toast.success('Disease detection completed!');
    } catch (error) {
      toast.error('Failed to detect disease');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Low':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'Critical':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const handlePrintReport = () => {
    if (!result) return;
    const d = result.disease;
    const html = `
      <!DOCTYPE html><html><head><title>Disease Report - Smart AgriTech</title>
      <style>body{font-family:Arial,sans-serif;padding:24px;max-width:700px;margin:0 auto}
      h1{color:#16a34a}h2{margin-top:20px;border-bottom:1px solid #eee;padding-bottom:6px}
      .meta{color:#666;font-size:14px}</style></head><body>
      <h1>Smart AgriTech — Disease Detection Report</h1>
      <p class="meta">Farmer: ${user?.name || 'N/A'} | Date: ${new Date().toLocaleString()}</p>
      <h2>${d.name}</h2><p><em>${d.scientificName || ''}</em></p>
      <p><strong>Severity:</strong> ${d.severity} | <strong>Confidence:</strong> ${result.confidence}%</p>
      <h2>Symptoms</h2><ul>${(d.symptoms || []).map((s) => `<li>${s}</li>`).join('')}</ul>
      <h2>Prevention</h2><ul>${(d.prevention || []).map((s) => `<li>${s}</li>`).join('')}</ul>
      <h2>Treatment</h2><p>${d.treatment || 'Consult local agronomist.'}</p>
      <h2>Affected Crops</h2><p>${(d.affectedCrops || []).join(', ')}</p>
      <p style="margin-top:32px;font-size:12px;color:#888">AI-assisted advisory only. Confirm with agricultural expert before treatment.</p>
      </body></html>`;
    const w = window.open('', '_blank');
    w.document.write(html);
    w.document.close();
    w.focus();
    w.print();
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'Low':
        return <CheckCircle className='h-5 w-5' />;
      case 'Medium':
        return <AlertCircle className='h-5 w-5' />;
      case 'High':
        return <AlertCircle className='h-5 w-5' />;
      case 'Critical':
        return <XCircle className='h-5 w-5' />;
      default:
        return <AlertCircle className='h-5 w-5' />;
    }
  };

  return (
    <div className='flex'>
      <Sidebar />
      <div className='flex-1 p-8'>
        <div className='mb-8'>
          <h1 className='page-heading'>Disease Detection</h1>
          <p className='page-subtext'>
            Upload a plant image to detect diseases and get treatment recommendations
          </p>
        </div>

        <div className='ai-banner'>
          <strong>Advisory note:</strong> Results support farming decisions; always verify with a local
          agronomist or Krishi Vigyan Kendra before applying chemicals.
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='card'>
            <h2 className='text-xl font-semibold text-gray-900 mb-6'>Upload Image</h2>

            <div className='border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors'>
              {preview ? (
                <div className='space-y-4'>
                  <img
                    src={preview}
                    alt='Preview'
                    className='max-h-64 mx-auto rounded-lg'
                  />
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreview(null);
                      setResult(null);
                    }}
                    className='text-red-600 hover:text-red-700 text-sm'
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <div className='space-y-4'>
                  <Upload className='h-12 w-12 mx-auto text-gray-400' />
                  <div>
                    <p className='text-gray-600'>Drag and drop an image here, or</p>
                    <label className='btn-primary inline-block cursor-pointer mt-2'>
                      Browse Files
                      <input
                        type='file'
                        accept='image/*'
                        onChange={handleFileSelect}
                        className='hidden'
                      />
                    </label>
                  </div>
                  <p className='text-sm text-gray-500'>PNG, JPG, GIF up to 5MB</p>
                </div>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={!selectedFile || loading}
              className='w-full btn-primary mt-6 flex items-center justify-center space-x-2 disabled:opacity-50'
            >
              {loading ? 'Analyzing...' : 'Detect Disease'}
            </button>
          </div>

          <div className='card'>
            <h2 className='text-xl font-semibold text-gray-900 mb-6'>Detection Results</h2>

            {loading ? (
              <ScanLoader message={scanMessage} progress={scanProgress} />
            ) : result ? (
              <div className='space-y-6' id='disease-report'>
                {result.aiPowered === false && (
                  <div className='ai-banner'>
                    Reference catalog shown — add GEMINI_API_KEY for full AI vision analysis.
                  </div>
                )}
                <div className='flex justify-end'>
                  <button
                    type='button'
                    onClick={handlePrintReport}
                    className='flex items-center space-x-2 text-sm btn-primary py-2 px-4'
                  >
                    <FileDown className='h-4 w-4' />
                    <span>Download / Print Report</span>
                  </button>
                </div>
                <div className='flex items-center justify-between p-4 bg-primary-50 rounded-xl border border-primary-200'>
                  <div className='flex items-center space-x-3'>
                    <Stethoscope className='h-8 w-8 text-primary-600' />
                    <div>
                      <h3 className='font-semibold text-gray-900'>{result.disease.name}</h3>
                      <p className='text-sm text-gray-600'>{result.disease.scientificName}</p>
                    </div>
                  </div>
                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getSeverityColor(result.disease.severity)}`}>
                    {getSeverityIcon(result.disease.severity)}
                    <span className='text-sm font-medium'>{result.disease.severity}</span>
                  </div>
                </div>

                <div className='bg-blue-50 border border-blue-200 rounded-xl p-4'>
                  <h4 className='font-semibold text-blue-900 mb-2'>Confidence Level</h4>
                  <div className='flex items-center space-x-2'>
                    <div className='flex-1 bg-gray-200 rounded-full h-3'>
                      <div
                        className='bg-primary-600 h-3 rounded-full transition-all'
                        style={{ width: `${result.confidence}%` }}
                      ></div>
                    </div>
                    <span className='text-sm font-medium text-blue-800'>{result.confidence}%</span>
                  </div>
                </div>

                <div>
                  <h4 className='font-semibold text-gray-900 mb-3'>Symptoms</h4>
                  <ul className='space-y-2'>
                    {(result.disease.symptoms || []).map((symptom, index) => (
                      <li key={index} className='flex items-start space-x-2 text-sm text-gray-700'>
                        <span className='text-red-500 mt-1'></span>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className='font-semibold text-gray-900 mb-3'>Prevention</h4>
                  <ul className='space-y-2'>
                    {(result.disease.prevention || []).map((item, index) => (
                      <li key={index} className='flex items-start space-x-2 text-sm text-gray-700'>
                        <CheckCircle className='h-4 w-4 text-green-500 mt-0.5 flex-shrink-0' />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className='font-semibold text-gray-900 mb-3'>Treatment</h4>
                  <p className='text-sm text-gray-700 bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                    {result.disease.treatment}
                  </p>
                </div>

                <div>
                  <h4 className='font-semibold text-gray-900 mb-3'>Affected Crops</h4>
                  <div className='flex flex-wrap gap-2'>
                    {(result.disease.affectedCrops || []).map((crop, index) => (
                      <span
                        key={index}
                        className='bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm'
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className='text-center py-12 text-gray-500'>
                <Stethoscope className='h-12 w-12 mx-auto mb-4 text-gray-300' />
                <p>Upload a plant image to detect diseases</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;
