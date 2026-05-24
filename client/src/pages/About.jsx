import { useEffect, useState } from 'react';
import { Leaf, Target, Shield, Users, Award, Zap } from 'lucide-react';
import axios from '../utils/axios';

const About = () => {
  const [platformStats, setPlatformStats] = useState({
    farmers: 0,
    recommendations: 0,
    products: 0,
    modules: 6,
  });

  useEffect(() => {
    axios
      .get('/api/public/stats')
      .then((res) => setPlatformStats(res.data))
      .catch(() => {});
  }, []);

  const values = [
    {
      icon: Target,
      title: 'Mission',
      description:
        'To empower farmers with AI-driven solutions that increase productivity, reduce costs, and promote sustainable agriculture practices.',
    },
    {
      icon: Shield,
      title: 'Vision',
      description:
        'To make smart farming accessible through cloud-connected technology and data-driven advisory tools.',
    },
    {
      icon: Users,
      title: 'Community',
      description:
        'Connecting farmers, agronomists, and technology for better agricultural outcomes.',
    },
  ];

  const features = [
    {
      icon: Award,
      title: 'AI-Powered Advisory',
      description: 'Crop, fertilizer, and disease insights using Google Gemini on cloud infrastructure.',
    },
    {
      icon: Zap,
      title: 'Fast & Reliable',
      description: 'Instant recommendations with secure login and recommendation history.',
    },
    {
      icon: Leaf,
      title: 'Sustainable',
      description: 'Promoting informed fertilizer use and early disease detection for better yields.',
    },
  ];

  const stats = [
    { number: String(platformStats.farmers), label: 'Registered Farmers' },
    { number: String(platformStats.recommendations), label: 'AI Recommendations' },
    { number: String(platformStats.products), label: 'Marketplace Products' },
    { number: String(platformStats.modules), label: 'Core Modules' },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      <section className='bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center'>
            <div className='flex items-center justify-center space-x-2 mb-6'>
              <Leaf className='h-12 w-12' />
              <h1 className='text-4xl md:text-5xl font-bold'>About Smart AgriTech</h1>
            </div>
            <p className='text-xl max-w-3xl mx-auto text-primary-100'>
              A final-year cloud-connected agriculture platform — AI advisory, weather, disease
              detection, and marketplace in one place.
            </p>
          </div>
        </div>
      </section>

      <section className='py-16 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <p className='text-center text-sm text-gray-500 mb-6'>
            Live statistics from the platform database (MongoDB Atlas)
          </p>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            {stats.map((stat, index) => (
              <div key={index} className='text-center'>
                <div className='text-4xl font-bold text-primary-600 mb-2'>{stat.number}</div>
                <div className='text-gray-600'>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <div>
              <h2 className='text-3xl font-bold text-gray-900 mb-6'>Our Story</h2>
              <p className='text-gray-600 mb-4'>
                Smart AgriTech was built to address fragmented farming decisions — farmers often
                rely on separate sources for crop choice, fertilizer, disease diagnosis, and weather.
              </p>
              <p className='text-gray-600'>
                This platform unifies those needs with a modern web stack, cloud database, and AI
                services, plus an admin panel for monitoring usage and farmer activity.
              </p>
            </div>
            <div className='bg-primary-100 rounded-2xl p-8'>
              <div className='grid grid-cols-2 gap-6'>
                <div className='bg-white rounded-lg p-6 text-center'>
                  <Leaf className='h-8 w-8 text-primary-600 mx-auto mb-3' />
                  <h3 className='font-semibold text-gray-900 mb-2'>Stack</h3>
                  <p className='text-gray-600 text-sm'>MERN + Gemini</p>
                </div>
                <div className='bg-white rounded-lg p-6 text-center'>
                  <Users className='h-8 w-8 text-primary-600 mx-auto mb-3' />
                  <h3 className='font-semibold text-gray-900 mb-2'>Users</h3>
                  <p className='text-gray-600 text-sm'>Farmer & Admin</p>
                </div>
                <div className='bg-white rounded-lg p-6 text-center'>
                  <Award className='h-8 w-8 text-primary-600 mx-auto mb-3' />
                  <h3 className='font-semibold text-gray-900 mb-2'>Database</h3>
                  <p className='text-gray-600 text-sm'>MongoDB Atlas</p>
                </div>
                <div className='bg-white rounded-lg p-6 text-center'>
                  <Zap className='h-8 w-8 text-primary-600 mx-auto mb-3' />
                  <h3 className='font-semibold text-gray-900 mb-2'>Deployment</h3>
                  <p className='text-gray-600 text-sm'>Cloud-ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>Our Values</h2>
          </div>
          <div className='grid md:grid-cols-3 gap-8'>
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className='card text-center'>
                  <div className='bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Icon className='h-8 w-8 text-primary-600' />
                  </div>
                  <h3 className='text-xl font-semibold text-gray-900 mb-3'>{value.title}</h3>
                  <p className='text-gray-600'>{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className='py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>Why Choose Us?</h2>
          </div>
          <div className='grid md:grid-cols-3 gap-8'>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className='card'>
                  <div className='flex items-start space-x-4'>
                    <div className='bg-primary-100 p-3 rounded-lg flex-shrink-0'>
                      <Icon className='h-6 w-6 text-primary-600' />
                    </div>
                    <div>
                      <h3 className='text-lg font-semibold text-gray-900 mb-2'>{feature.title}</h3>
                      <p className='text-gray-600'>{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className='py-20 bg-primary-600 text-white'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
          <h2 className='text-3xl font-bold mb-4'>Ready to Transform Your Farm?</h2>
          <a
            href='/register'
            className='inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors text-lg'
          >
            Get Started Free
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
