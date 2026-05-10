import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/listings').then(res => setListings(res.data));
  }, []);

  const filtered = listings.filter(l => l.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <input 
        type="text" placeholder="Search items..." 
        className="w-full p-4 rounded-2xl border border-slate-200 mb-8 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map(item => (
          <Link to={`/listing/${item._id}`} key={item._id} className="group flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="aspect-square bg-slate-100 overflow-hidden">
              <img src={`http://localhost:5000${item.images[0]}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-4 flex flex-col flex-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</span>
              <h3 className="font-bold text-slate-900 mt-1 line-clamp-1">{item.title}</h3>
              <p className="text-xl font-black text-emerald-500 mt-2">₹{item.price}</p>
              <p className="mt-auto pt-4 text-xs text-slate-500">Seller: {item.sellerId.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default Home;