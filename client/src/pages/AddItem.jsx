import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddItem = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', price: '', category: 'Textbooks'
  });
  const [images, setImages] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setImages(e.target.files);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    
    if (images) {
      for (let i = 0; i < images.length; i++) {
        data.append('images', images[i]);
      }
    }

    try {
      await api.post('/listings', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success("Item posted successfully!");
      navigate('/');
    } catch (err) {
      toast.error('Failed to add item. Check file size (Max 10MB).');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 px-4 min-h-[80vh] flex justify-center">
      <div className="max-w-2xl w-full bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-100">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Sell an Item</h2>
        <p className="text-slate-500 mb-8 font-medium">Post your item to the Campus Cart marketplace.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Listing Title</label>
            <input 
              type="text" name="title" required onChange={handleChange} 
              placeholder="e.g., Fundamentals of Physics, 10th Ed."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-2">Price (₹)</label>
              <input 
                type="number" name="price" required onChange={handleChange} min="0"
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 font-bold text-lg text-emerald-600"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
              <select 
                name="category" onChange={handleChange} 
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 cursor-pointer"
              >
                <option value="Textbooks">Textbooks</option>
                <option value="Electronics">Electronics</option>
                <option value="Dorm Furniture">Dorm Furniture</option>
                <option value="Instruments">Instruments</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
            <textarea 
              name="description" required onChange={handleChange} rows="4"
              placeholder="Describe the condition, features, and any other details..."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50 resize-none"
            ></textarea>
          </div>

          <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50">
            <label className="block text-sm font-bold text-slate-700 mb-2">Upload Images (Max 5)</label>
            <input 
              type="file" multiple accept="image/*" onChange={handleFileChange} 
              className="w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-4 mt-4 font-bold rounded-xl transition-all shadow-md text-lg ${isSubmitting ? 'bg-slate-400 text-white cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            {isSubmitting ? 'Posting Item...' : 'Post Item Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddItem;