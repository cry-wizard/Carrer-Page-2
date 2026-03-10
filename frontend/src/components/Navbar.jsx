import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, ArrowUpRight } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white px-6 py-4 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img 
            src="https://centennial-infotech-hiring.netlify.app/assets/logo-centennial-CATzLfT_.png" 
            alt="Centennial Infotech Logo" 
            className="h-10 w-auto" 
          />
        </Link>

        {/* Dynamic Navigation */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-sm font-semibold text-gray-800 hover:text-brand-blue transition-colors">Jobs</Link>
          
          {user ? (
            <>
              {user.role === 'admin' ? (
                <Link to="/admin" className="text-sm font-semibold text-gray-800 hover:text-brand-blue transition-colors">Dashboard</Link>
              ) : (
                <Link to="/my-applications" className="text-sm font-semibold text-gray-800 hover:text-brand-blue transition-colors">My Applications</Link>
              )}
              
              <div className="flex items-center space-x-4 pl-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <User size={16} className="text-brand-blue" />
                  </div>
                  <span className="font-semibold text-sm hidden sm:block">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="px-5 py-2.5 text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full transition-colors focus:outline-none flex items-center gap-2"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-6">
              <Link to="/login" className="text-sm font-semibold text-slate-800 hover:text-brand-blue transition-colors">Login</Link>
              <Link to="/register" className="group btn-premium btn-premium-primary text-white px-6 py-2.5 rounded-2xl text-sm font-medium transition flex items-center gap-1.5 shadow-lg bg-brand-blue hover:bg-brand-blue-hover">
                Join Now 
                <div className="transition-transform duration-300 group-hover:rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
