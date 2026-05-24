import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CropRecommendation from './pages/CropRecommendation';
import FertilizerRecommendation from './pages/FertilizerRecommendation';
import WeatherMonitoring from './pages/WeatherMonitoring';
import DiseaseDetection from './pages/DiseaseDetection';
import FarmerProfile from './pages/FarmerProfile';
import AdminDashboard from './pages/AdminDashboard';
import History from './pages/History';
import Marketplace from './pages/Marketplace';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Contact from './pages/Contact';
import About from './pages/About';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { AnimatedPage } from './components/Animated';
import ScrollToTop from './components/ScrollToTop';

const toastOptions = {
  duration: 3500,
  style: {
    borderRadius: '10px',
    background: '#14532d',
    color: '#fff',
    fontSize: '14px',
  },
  success: { iconTheme: { primary: '#86efac', secondary: '#14532d' } },
  error: { style: { background: '#7f1d1d' }, iconTheme: { primary: '#fca5a5', secondary: '#7f1d1d' } },
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className='min-h-screen flex flex-col bg-gray-50'>
            <Navbar />
            <ScrollToTop />
            <main className='flex-grow'>
              <AnimatedPage>
              <Routes>
                <Route path='/' element={<Landing />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/about' element={<About />} />
                <Route path='/contact' element={<Contact />} />
                <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path='/crop-recommendation' element={<ProtectedRoute><CropRecommendation /></ProtectedRoute>} />
                <Route path='/fertilizer-recommendation' element={<ProtectedRoute><FertilizerRecommendation /></ProtectedRoute>} />
                <Route path='/weather' element={<ProtectedRoute><WeatherMonitoring /></ProtectedRoute>} />
                <Route path='/disease-detection' element={<ProtectedRoute><DiseaseDetection /></ProtectedRoute>} />
                <Route path='/profile' element={<ProtectedRoute><FarmerProfile /></ProtectedRoute>} />
                <Route path='/history' element={<ProtectedRoute><History /></ProtectedRoute>} />
                <Route path='/marketplace' element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
                <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path='/orders' element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path='/admin' element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              </Routes>
              </AnimatedPage>
            </main>
            <Footer />
            <Toaster position='top-right' toastOptions={toastOptions} />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
