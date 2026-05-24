const ScanLoader = ({ message = 'Analyzing plant image...', progress }) => (
  <div className='flex flex-col items-center justify-center py-12 px-4'>
    <div className='relative w-48 h-48 mb-8'>
      <div className='absolute inset-0 rounded-2xl border-2 border-primary-200 bg-primary-50 overflow-hidden'>
        <div className='scan-line absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent' />
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='grid grid-cols-4 gap-2 opacity-50'>
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className='w-3 h-3 rounded-sm bg-primary-400 animate-pulse'
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
    <p className='text-primary-700 text-sm font-medium uppercase mb-2'>
      Scanning Image
    </p>
    <p className='text-gray-600 text-sm text-center max-w-xs'>{message}</p>
    {progress != null && (
      <div className='w-48 mt-4 h-1.5 bg-gray-200 rounded-full overflow-hidden'>
        <div
          className='h-full bg-primary-600 transition-all duration-300'
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    )}
  </div>
);

export default ScanLoader;
