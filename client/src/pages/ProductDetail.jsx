import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [item, setItem] = useState(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    api.get(`/listings/${id}`).then(res => setItem(res.data)).catch(() => toast.error("Item not found"));
    if (user) {
      api.get('/users/saved').then(res => setIsSaved(res.data.some(s => s._id === id)));
    }
  }, [id, user]);

  const handleSave = async () => {
  if (!user) {
    toast.error("Please login to save items!");
    return;
  }
  
  try {
    // The interceptor now handles the headers for you!
    await api.post(`/users/save/${id}`); 
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from Wishlist" : "Saved to Wishlist");
  } catch (err) {
    toast.error("Failed to save item. Are you logged in?");
    console.error(err);
  }
};

  if (!item) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 flex flex-col md:flex-row gap-10">
      <div className="flex-1 rounded-3xl overflow-hidden bg-slate-100 border aspect-square md:aspect-auto">
        <img src={`http://localhost:5000${item.images[0]}`} className="w-full h-full object-contain" />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-blue-600 font-bold uppercase text-xs tracking-widest">{item.category}</span>
        <h1 className="text-3xl md:text-5xl font-black mt-2 mb-4 break-words [overflow-wrap:anywhere]">{item.title}</h1>
        <p className="text-4xl font-black text-emerald-500 mb-8">₹{item.price}</p>
        <p className="text-slate-600 text-lg leading-relaxed mb-10 whitespace-pre-wrap [overflow-wrap:anywhere]">{item.description}</p>
        <div className="flex gap-4 flex-col sm:flex-row mb-8">
          <a href={`mailto:${item.sellerId.collegeEmail}`} className="flex-1 bg-blue-600 text-white text-center py-4 rounded-xl font-bold text-lg">Contact Seller</a>
          <button onClick={handleSave} className={`flex-1 py-4 rounded-xl font-bold text-lg border-2 ${isSaved ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white border-slate-200'}`}>
            {isSaved ? "❤️ Saved" : "🤍 Save Item"}
          </button>
        </div>
        <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-xl">{item.sellerId.name[0]}</div>
            <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Posted By</p>
                <p className="font-bold text-slate-800">{item.sellerId.name}</p>
            </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetail;