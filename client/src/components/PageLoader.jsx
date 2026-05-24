import LoadingSpinner from './LoadingSpinner';

const PageLoader = ({ label = 'Loading module...' }) => (
  <div className='min-h-[50vh] flex items-center justify-center'>
    <LoadingSpinner size='lg' label={label} />
  </div>
);

export default PageLoader;
