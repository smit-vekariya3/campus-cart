import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('selling'); 
  const [myListings, setMyListings] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingsRes, savedRes] = await Promise.all([
          api.get('/listings/my-listings'),
          api.get('/users/saved')
        ]);
        setMyListings(listingsRes.data);
        setSavedItems(savedRes.data);
      } catch (err) {
        toast.error('Error fetching profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item? This cannot be undone.')) {
      try {
        await api.delete(`/listings/${id}`);
        setMyListings(myListings.filter(item => item._id !== id));
        toast.success("Item deleted forever.");
      } catch (err) {
        toast.error('Failed to delete item');
      }
    }
  };

  const handleMarkSold = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Sold' : 'Active';
    try {
      await api.put(`/listings/${id}/status`, { status: newStatus });
      setMyListings(myListings.map(item => item._id === id ? { ...item, status: newStatus } : item));
      toast.success(`Item marked as ${newStatus}!`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const renderItemCard = (item, isSavedTab) => (
    <div key={item._id} className="flex flex-col sm:flex-row items-center bg-white border border-slate-200 p-4 md:p-6 rounded-2xl gap-6 mb-4 shadow-sm hover:shadow-md transition-shadow">
      
      {/* Thumbnail */}
      <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-slate-100 rounded-xl overflow-hidden relative">
        {item.images && item.images.length > 0 ? (
          <img src={`http://localhost:5000${item.images[0]}`} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm font-medium">No Image</div>
        )}
      </div>

      {/* Item Details */}
      <div className="flex-1 w-full text-center sm:text-left">
        <Link to={`/listing/${item._id}`} className="group outline-none">
          <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">{item.title}</h3>
        </Link>
        <p className="text-2xl font-black text-emerald-500 mb-2">₹{item.price}</p>
        <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-slate-100 text-slate-600">
          Status: <span className={item.status === 'Active' ? 'text-emerald-500' : 'text-red-500'}>{item.status}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col w-full sm:w-auto gap-3 shrink-0">
        {isSavedTab ? (
          <Link to={`/listing/${item._id}`} className="text-center py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
            View Details
          </Link>
        ) : (
          <>
            <button onClick={() => handleMarkSold(item._id, item.status)} 
              className={`py-2 px-6 font-bold rounded-xl transition-colors ${item.status === 'Active' ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-emerald-500 hover:bg-emerald-600 text-white'}`}>
              {item.status === 'Active' ? 'Mark as Sold' : 'Relist Item'}
            </button>
            <button onClick={() => handleDelete(item._id)} className="py-2 px-6 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl transition-colors">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );

  if (loading) return <h3 className="text-xl font-semibold text-slate-600 mt-10 text-center">Loading Dashboard...</h3>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-8 tracking-tight">My Dashboard</h2>
      
      {/* Tab Navigation */}
      <div className="flex gap-8 mb-8 border-b-2 border-slate-100 overflow-x-auto">
        <button onClick={() => setActiveTab('selling')} 
          className={`pb-4 text-lg font-bold transition-all whitespace-nowrap border-b-4 ${activeTab === 'selling' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
          Selling ({myListings.length})
        </button>
        <button onClick={() => setActiveTab('saved')} 
          className={`pb-4 text-lg font-bold transition-all whitespace-nowrap border-b-4 ${activeTab === 'saved' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
          Saved Items ({savedItems.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'selling' && (
          <div className="animate-fade-in">
            {myListings.length === 0 
              ? <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed text-slate-500">You haven't posted any items yet.</div>
              : myListings.map(item => renderItemCard(item, false))}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="animate-fade-in">
            {savedItems.length === 0 
              ? <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed text-slate-500">Your wishlist is empty. Go find some deals!</div> 
              : savedItems.map(item => renderItemCard(item, true))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;