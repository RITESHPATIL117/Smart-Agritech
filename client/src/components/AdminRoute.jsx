import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <Loader2 className='h-8 w-8 animate-spin text-primary-600' />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to='/dashboard' replace />;
  }

  return children;
};

export default AdminRoute;
