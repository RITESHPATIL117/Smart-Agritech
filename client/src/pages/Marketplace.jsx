import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ProductSkeleton from '../components/ProductSkeleton';
import { useCart } from '../context/CartContext';
import { Search, ShoppingCart, Star, Plus, Store } from 'lucide-react';
import axios from '../utils/axios';
import toast from 'react-hot-toast';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'seeds', label: 'Seeds' },
  { id: 'fertilizer', label: 'Fertilizer' },
  { id: 'pesticide', label: 'Pesticide' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'tools', label: 'Tools' },
];

const Marketplace = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const { addToCart, cartCount } = useCart();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category !== 'all') params.set('category', category);
      if (search.trim()) params.set('search', search.trim());
      const res = await axios.get(`/api/marketplace/products?${params}`);
      setProducts(res.data);
    } catch (e) {
      toast.error('Failed to load marketplace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleAdd = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className='flex'>
      <Sidebar />
      <div className='flex-1 p-8'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8'>
          <div>
            <h1 className='page-heading flex items-center gap-2'>
              <Store className='h-8 w-8 text-primary-600' />
              Agri Marketplace
            </h1>
            <p className='page-subtext'>Seeds, fertilizers, equipment — COD checkout</p>
          </div>
          <Link to='/cart' className='btn-primary inline-flex items-center gap-2 w-fit'>
            <ShoppingCart className='h-5 w-5' />
            Cart ({cartCount})
          </Link>
        </div>

        <div className='card mb-6'>
          <form onSubmit={handleSearch} className='flex flex-col sm:flex-row gap-3'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400' />
              <input
                type='text'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search seeds, fertilizer, tools...'
                className='input-field pl-10'
              />
            </div>
            <button type='submit' className='btn-primary px-8'>Search</button>
          </form>
          <div className='flex flex-wrap gap-2 mt-4'>
            {categories.map((c) => (
              <button
                key={c.id}
                type='button'
                onClick={() => setCategory(c.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  category === c.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className='card text-center py-16 text-gray-500'>
            No products found. Run <code className='text-primary-600'>npm run seed</code> on server.
          </div>
        ) : (
          <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {products.map((p) => (
              <div key={p._id} className='card-interactive'>
                <div className='text-5xl text-center py-6 bg-gray-50 rounded-xl mb-4'>
                  {p.image}
                </div>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-xs font-medium uppercase text-primary-700 bg-primary-50 px-2 py-0.5 rounded'>
                    {p.category}
                  </span>
                  <span className='flex items-center gap-1 text-amber-600 text-xs'>
                    <Star className='h-3 w-3 fill-amber-500' /> {p.rating}
                  </span>
                </div>
                <h3 className='font-semibold text-gray-900 mb-1'>{p.name}</h3>
                <p className='text-gray-600 text-sm line-clamp-2 mb-3'>{p.description}</p>
                <p className='text-xs text-gray-500 mb-3'>
                  {p.sellerName} · {p.location}
                </p>
                <div className='flex items-center justify-between'>
                  <div>
                    <span className='text-xl font-bold text-primary-700'>₹{p.price}</span>
                    <span className='text-xs text-gray-500 ml-1'>{p.unit}</span>
                    <p className='text-xs text-gray-500 mt-1'>{p.stock} in stock</p>
                  </div>
                  <button
                    type='button'
                    onClick={() => handleAdd(p)}
                    disabled={p.stock < 1}
                    className='p-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-40'
                  >
                    <Plus className='h-5 w-5' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className='mt-8 text-center'>
          <Link to='/orders' className='text-primary-600 hover:text-primary-700 text-sm font-medium'>
            View my orders →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
