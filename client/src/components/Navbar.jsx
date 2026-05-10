import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="flex flex-col md:flex-row justify-between items-center px-6 py-4 bg-slate-900 text-white sticky top-0 z-50 gap-4">
      <Link to="/" className="text-2xl font-bold tracking-tighter">Campus Cart</Link>
      <div className="flex items-center gap-4 md:gap-8 font-medium text-sm md:text-base">
        {user ? (
          <>
            <Link to="/add-item" className="hover:text-blue-400 transition-colors">+ Post Item</Link>
            <Link to="/profile" className="hover:text-blue-400 transition-colors">My Dashboard</Link>
            <button onClick={() => { logout(); navigate('/login'); }} className="bg-red-500 px-4 py-2 rounded-lg font-bold">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="bg-blue-600 px-4 py-2 rounded-lg">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};
export default Navbar;