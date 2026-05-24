const ProductSkeleton = () => (
  <div className='card overflow-hidden'>
    <div className='h-24 skeleton-shimmer rounded-xl mb-4' />
    <div className='h-4 skeleton-shimmer rounded w-3/4 mb-2' />
    <div className='h-3 skeleton-shimmer rounded w-full mb-4' />
    <div className='h-8 skeleton-shimmer rounded w-1/2' />
  </div>
);

export default ProductSkeleton;
