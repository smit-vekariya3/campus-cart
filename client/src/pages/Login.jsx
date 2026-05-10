import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ collegeEmail: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Ensure you are passing 'formData' directly
  const success = await login(formData); 
  
  if (success) {
    toast.success("Welcome back!");
    navigate('/');
  } else {
    toast.error('Login failed. Check your credentials.');
  }
};
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2 text-center">Welcome Back</h2>
        <p className="text-slate-500 text-center mb-8 font-medium">Log in to your Campus Cart account</p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">College Email</label>
            <input 
              type="email" name="collegeEmail" 
              placeholder="student@college.edu.in" 
              onChange={handleChange} required 
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Password</label>
            <input 
              type="password" name="password" 
              placeholder="••••••••" 
              onChange={handleChange} required 
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-slate-50"
            />
          </div>

          <button type="submit" className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md mt-2 text-lg">
            Sign In
          </button>
        </form>

        <p className="text-center text-slate-600 mt-8 font-medium">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:text-blue-800 font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;