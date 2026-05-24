const LoadingSpinner = ({ size = 'md', label }) => {
  const sizes = { sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-16 h-16' };

  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <div
        className={`${sizes[size] || sizes.md} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`}
      />
      {label && <p className='text-sm text-gray-600'>{label}</p>}
    </div>
  );
};

export default LoadingSpinner;
