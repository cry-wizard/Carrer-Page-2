import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, CheckCircle2, Sparkles, User as UserIcon, Phone } from 'lucide-react';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // Default to user, but allow admin creation for demo purposes, or just default to user
  const [role, setRole] = useState('user');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      await register(fullName, email, password, role);
      if (role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
              Launch your <br />
              career to new <br />
              heights
            </h1>
            
            <p className="text-blue-100 text-sm mb-10 leading-relaxed font-medium">
              Join Centennial Talent Solutions' elite network of tech professionals and get hired by global innovators.
            </p>

            <div className="space-y-4">
              <div className="flex items-center text-white/90 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 mr-3 text-[#00c6ff]" /> Tailored career opportunities
              </div>
              <div className="flex items-center text-white/90 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 mr-3 text-[#00c6ff]" /> Direct outreach from top firms
              </div>
              <div className="flex items-center text-white/90 text-sm font-medium">
                <CheckCircle2 className="w-5 h-5 mr-3 text-[#00c6ff]" /> Real-time application tracking
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-white/20">
            <p className="text-white/60 text-xs font-semibold tracking-wider">
              POWERED BY <br/>
              <span className="text-white text-base font-bold mt-1 inline-block">Centennial <span className="text-[#00c6ff] font-medium">Infotech</span></span>
            </p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-white">
          <div className="max-w-[380px] w-full mx-auto">
            <h2 className="text-[28px] font-bold text-[#0F172A] mb-2 tracking-tight">Create Account</h2>
            <p className="text-[#64748B] text-sm mb-8 font-medium">Enter your details to get started</p>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-start">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">First Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <UserIcon className="h-4 w-4 text-[#94A3B8]" />
                    </div>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-[#E2E8F0] rounded-xl focus:ring-1 focus:ring-brand-blue focus:border-brand-blue text-sm transition-colors text-gray-900 placeholder-[#CBD5E1] outline-none"
                      placeholder="Jane"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Last Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="block w-full px-4 py-3 border border-[#E2E8F0] rounded-xl focus:ring-1 focus:ring-brand-blue focus:border-brand-blue text-sm transition-colors text-gray-900 placeholder-[#CBD5E1] outline-none"
                      placeholder="Doe"
                    />
                  </div>
                </div>
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-[#94A3B8]" />
                    </div>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-[#E2E8F0] rounded-xl focus:ring-1 focus:ring-brand-blue focus:border-brand-blue text-sm transition-colors text-gray-900 placeholder-[#CBD5E1] outline-none"
                      placeholder="+91..."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-[#94A3B8]" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 border border-[#E2E8F0] rounded-xl focus:ring-1 focus:ring-brand-blue focus:border-brand-blue text-sm transition-colors text-gray-900 placeholder-[#CBD5E1] outline-none"
                      placeholder="••••••••"
                      minLength="6"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer">
                      <Eye className="h-4 w-4 text-[#94A3B8]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Added invisible role selector just for demo purposes so user can create admin */}
              <select className="hidden" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-brand-blue hover:bg-brand-blue-hover focus:outline-none transition-all mt-8"
              >
                {isLoading ? 'Creating Account...' : 'Start My Journey'}
              </button>
            </form>
            
            <p className="text-center text-sm text-[#64748B] font-medium mt-8">
              Already have an account? <Link to="/login" className="font-bold text-brand-blue hover:text-brand-blue-hover underline decoration-2 underline-offset-2">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
