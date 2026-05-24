import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import {
  Leaf,
  Sprout,
  CloudSun,
  Stethoscope,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Shield,
  Store,
} from 'lucide-react';
import { AnimatedSection, StaggerItem } from '../components/Animated';
import CountUp from '../components/CountUp';

const Landing = () => {
  const [platformStats, setPlatformStats] = useState({
    farmers: 0,
    recommendations: 0,
    products: 0,
    modules: 6,
  });

  useEffect(() => {
    axios.get('/api/public/stats').then((res) => setPlatformStats(res.data)).catch(() => {});
  }, []);

  const features = [
    {
      icon: Sprout,
      title: 'AI Crop Recommendations',
      description: 'Gemini-powered crop suggestions based on soil and climate data.',
    },
    {
      icon: CloudSun,
      title: 'Weather Monitoring',
      description: 'Real-time weather and forecasts for farming decisions.',
    },
    {
      icon: Stethoscope,
      title: 'Disease Detection',
      description: 'Upload plant images for AI vision disease analysis.',
    },
    {
      icon: Shield,
      title: 'Fertilizer Suggestions',
      description: 'Smart fertilizer recommendations for better yield.',
    },
    {
      icon: Store,
      title: 'Agri Marketplace',
      description: 'Buy seeds, fertilizer & equipment with order tracking.',
    },
  ];

  const benefits = [
    'AI-powered crop and fertilizer advice',
    'Early disease detection on crops',
    'Weather-based farming planning',
    'Marketplace with COD orders',
    'Secure farmer dashboard & history',
  ];

  const statCards = [
    { icon: Leaf, value: platformStats.farmers, suffix: '+', label: 'Farmers' },
    { icon: TrendingUp, value: platformStats.recommendations, suffix: '+', label: 'AI Insights' },
    { icon: CheckCircle, value: platformStats.modules, suffix: '', label: 'Modules' },
    { icon: Store, value: platformStats.products, suffix: '', label: 'Products' },
  ];

  return (
    <div className='min-h-screen overflow-hidden'>
      <section className='relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 md:py-28'>
        <div className='hero-blob w-72 h-72 bg-white top-10 -left-20' />
        <div className='hero-blob w-96 h-96 bg-primary-300 bottom-0 right-0 animation-delay-2000' style={{ animationDelay: '1s' }} />

        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <AnimatedSection>
              <span className='inline-block px-3 py-1 rounded-full bg-white/20 text-sm font-medium mb-4 animate-fade-in'>
                Cloud-powered agriculture platform
              </span>
              <h1 className='text-4xl md:text-5xl font-bold mb-6 leading-tight'>
                Smart Agriculture Powered by AI
              </h1>
              <p className='text-xl mb-8 text-primary-100'>
                Crop recommendations, disease detection, weather monitoring, and agri marketplace —
                all in one platform for modern farmers.
              </p>
              <div className='flex flex-col sm:flex-row gap-4'>
                <Link
                  to='/register'
                  className='bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 transition-all duration-200'
                >
                  Get Started <ArrowRight className='h-5 w-5 group-hover:translate-x-1 transition-transform' />
                </Link>
                <Link
                  to='/about'
                  className='border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-200 text-center'
                >
                  Learn More
                </Link>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={200} className='hidden md:block'>
              <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl animate-scale-in'>
                <div className='grid grid-cols-2 gap-6'>
                  {statCards.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <StaggerItem key={stat.label} index={i}>
                        <div className='bg-white/20 rounded-lg p-4 text-center hover:bg-white/30 transition-colors duration-300'>
                          <Icon className='h-8 w-8 mx-auto mb-2 motion-safe:animate-float' style={{ animationDelay: `${i * 0.2}s` }} />
                          <div className='text-2xl font-bold'>
                            <CountUp end={stat.value} suffix={stat.suffix} />
                          </div>
                          <div className='text-sm text-primary-100'>{stat.label}</div>
                        </div>
                      </StaggerItem>
                    );
                  })}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <AnimatedSection className='text-center mb-16'>
            <h2 className='text-3xl font-bold text-gray-900 mb-4'>Our Features</h2>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Tools designed to help farmers make better decisions every day.
            </p>
          </AnimatedSection>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <StaggerItem key={feature.title} index={index}>
                  <div className='card-interactive h-full group'>
                    <div className='bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300'>
                      <Icon className='h-6 w-6 text-primary-600' />
                    </div>
                    <h3 className='text-xl font-semibold text-gray-900 mb-2'>{feature.title}</h3>
                    <p className='text-gray-600'>{feature.description}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </div>
        </div>
      </section>

      <section className='py-20 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid md:grid-cols-2 gap-12 items-center'>
            <AnimatedSection>
              <h2 className='text-3xl font-bold text-gray-900 mb-6'>Why Smart AgriTech?</h2>
              <ul className='space-y-4'>
                {benefits.map((benefit, index) => (
                  <StaggerItem key={benefit} index={index}>
                    <li className='flex items-start gap-3'>
                      <CheckCircle className='h-6 w-6 text-primary-600 flex-shrink-0 mt-0.5' />
                      <span className='text-gray-700'>{benefit}</span>
                    </li>
                  </StaggerItem>
                ))}
              </ul>
            </AnimatedSection>
            <AnimatedSection delay={150}>
              <div className='bg-primary-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300'>
                <h3 className='text-2xl font-bold mb-4'>Ready to get started?</h3>
                <p className='mb-6 text-primary-100'>Create a free account and explore all features.</p>
                <Link
                  to='/register'
                  className='inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 hover:-translate-y-0.5 transition-all duration-200'
                >
                  Create Free Account <ArrowRight className='h-4 w-4' />
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className='py-20 bg-primary-600 text-white text-center relative overflow-hidden'>
        <div className='hero-blob w-64 h-64 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10' />
        <AnimatedSection className='max-w-4xl mx-auto px-4 relative z-10'>
          <h2 className='text-3xl font-bold mb-4'>Start Your Smart Farming Journey</h2>
          <p className='text-xl mb-8 text-primary-100'>Sign up and access AI tools built for farmers.</p>
          <Link
            to='/register'
            className='inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 hover:shadow-lg hover:-translate-y-1 text-lg transition-all duration-200'
          >
            Get Started Free
          </Link>
        </AnimatedSection>
      </section>
    </div>
  );
};

export default Landing;
