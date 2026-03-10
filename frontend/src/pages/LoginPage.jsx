import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, CheckCircle2, Sparkles } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <div className="bg-white max-w-[1000px] w-full rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side - Blue Brand Panel */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-between" style={{ background: 'linear-gradient(135deg, #0a4f80 0%, #0D62A0 60%, #1579c3 100%)' }}>
          <div>
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-10 border border-white/20">
              <Sparkles className="text-blue-200 w-6 h-6" />
            </div>
            
            <h1 className="text-white text-4xl font-bold mb-4 leading-tight">
              Welcome Back to <br />
              <span className="text-[#00c6ff]">Centennial<br/>Careers</span>
            </h1>
            
            <p className="text-blue-100 text-sm mb-10 leading-relaxed font-medium">
              Sign in to access your applications, manage your profile, and connect with global opportunities.
            </p>

            <div className="space-y-4">
              <div className="flex items-center text-white/90 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 mr-3 text-[#00c6ff]" /> Stay updated on application status
              </div>
              <div className="flex items-center text-white/90 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 mr-3 text-[#00c6ff]" /> Personalized job recommendations
              </div>
              <div className="flex items-center text-white/90 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 mr-3 text-[#00c6ff]" /> One-click applying to new roles
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-white/20">
            <p className="text-white/60 text-xs font-semibold tracking-wider">
              Powered by <span className="text-[#00c6ff] font-bold">Centennial Infotech</span>
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-white">
          <div className="max-w-[340px] w-full mx-auto">
            <h2 className="text-[28px] font-bold text-[#0F172A] mb-2 tracking-tight">Candidate Sign In</h2>
            <p className="text-[#64748B] text-sm mb-8 font-medium">Access your personal career dashboard</p>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-start">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-[#94A3B8]" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-3 py-3 border border-[#E2E8F0] rounded-xl focus:ring-1 focus:ring-brand-blue focus:border-brand-blue text-sm transition-colors text-gray-900 placeholder-[#CBD5E1] outline-none"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Password</label>
                  <a href="#" className="text-[11px] font-bold text-brand-blue uppercase tracking-wider hover:text-brand-blue-hover">Forgot Password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-[#94A3B8]" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-10 py-3 border border-[#E2E8F0] rounded-xl focus:ring-1 focus:ring-brand-blue focus:border-brand-blue text-sm transition-colors text-gray-900 placeholder-[#CBD5E1] outline-none"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center cursor-pointer">
                    <Eye className="h-4 w-4 text-[#94A3B8]" />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-brand-blue hover:bg-brand-blue-hover focus:outline-none transition-all mt-8"
              >
                {isLoading ? 'Signing In...' : 'Sign In Now →'}
              </button>
            </form>
            
            <p className="text-center text-sm text-[#64748B] font-medium mt-8">
              New to Centennial? <Link to="/register" className="font-bold text-brand-blue hover:text-brand-blue-hover underline decoration-2 underline-offset-2">Create Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
