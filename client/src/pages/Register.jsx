import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', collegeEmail: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/register', formData);
      toast.success("Account created successfully!");
      // Automatically log the user in after successful registration
      await login({ collegeEmail: formData.collegeEmail, password: formData.password });
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2 text-center">Create Account</h2>
        <p className="text-slate-500 text-center mb-8 font-medium">Join your campus marketplace today.</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" name="name" 
              placeholder="e.g. Smit Vekariya" 
              onChange={handleChange} required 
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">College Email</label>
            <input 
              type="email" name="collegeEmail" 
              placeholder="student@gtu.edu.in" 
              onChange={handleChange} required 
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <input 
              type="password" name="password" 
              placeholder="Create a strong password" 
              onChange={handleChange} required minLength="6"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50"
            />
          </div>

          <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md mt-2 text-lg">
            Register
          </button>
        </form>

        <p className="text-center text-slate-600 mt-8 font-medium">
          Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-800 font-bold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;