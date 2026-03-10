import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Briefcase, Calendar, DollarSign, Users, CheckCircle, FileText, Globe } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function JobDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyState, setApplyState] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const { data } = await api.get(`/jobs/${id}`);
      setJob(data);
    } catch (error) {
      console.error('Error fetching job details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) return;
    setApplyState({ loading: true, success: false, error: null });
    
    try {
      await api.post(`/applications/${job._id}`);
      setApplyState({ loading: false, success: true, error: null });
    } catch (error) {
       setApplyState({ 
         loading: false, 
         success: false, 
         error: error.response?.data?.message || 'Error applying for job' 
       });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
        <Link to="/" className="text-brand-blue hover:underline">Return to listings</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Back Link */}
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 font-medium text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Listings
        </Link>
        
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Main Content (Left) */}
          <div className="w-full lg:w-2/3 space-y-6">
            
            {/* Header Card */}
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-premium border border-slate-100 flex flex-col relative">
              <span className="absolute top-8 right-8 bg-green-50 text-green-600 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                OPEN
              </span>
              
              <div className="flex items-start mb-6">
                <div className="w-16 h-16 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center mr-6 shrink-0 border border-blue-100">
                  <Building2 size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-[#0F172A] mb-3 leading-tight tracking-tight">
                    {job.title}
                  </h1>
                  <div className="flex flex-wrap items-center text-sm gap-x-6 gap-y-3">
                    <span className="font-bold text-brand-blue">{job.department}</span>
                    <span className="flex items-center text-gray-500 font-medium">
                      <Briefcase className="w-4 h-4 mr-1.5 text-gray-400" /> {job.type}
                    </span>
                    <span className="flex items-center text-gray-500 font-medium">
                      <Calendar className="w-4 h-4 mr-1.5 text-gray-400" /> Posted {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-premium border border-slate-100">
              <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-brand-blue" />
                Job Overview
              </h2>
              
              <div className="prose prose-blue prose-custom max-w-none text-slate-600 leading-relaxed font-medium">
                {/* Splitting newlines for proper rendering if text breaks line */}
                {(job.description || '').split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </div>
            
          </div>

          {/* Sidebar (Right) */}
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            
            {/* Action & Highlights Card */}
            <div className="bg-white rounded-[2rem] p-8 shadow-premium border border-slate-100 relative overflow-hidden">
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-8">KEY HIGHLIGHTS</h3>
               
               <div className="space-y-6">
                 {job.salary && (
                   <div className="flex items-start">
                     <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 mr-4 shrink-0">
                       <DollarSign className="w-5 h-5" />
                     </div>
                     <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Monthly Compensation</p>
                       <p className="text-slate-900 font-black text-lg">{job.salary}</p>
                     </div>
                   </div>
                 )}

                 <div className="flex items-start">
                   <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mr-4 shrink-0">
                     <MapPin className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Primary Location</p>
                     <p className="text-slate-900 font-black text-lg leading-tight">{job.location}</p>
                     <span className="inline-block mt-2 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded">
                       {job.type}
                     </span>
                   </div>
                 </div>
                 
                 <div className="flex items-start">
                   <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mr-4 shrink-0">
                     <Briefcase className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Minimum Experience</p>
                     <p className="text-slate-900 font-black text-lg leading-tight">1 Year</p>
                   </div>
                 </div>

                 <div className="flex items-start">
                   <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 mr-4 shrink-0">
                     <Users className="w-5 h-5" />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Total Openings</p>
                     <p className="text-slate-900 font-black text-lg leading-tight">1 Position</p>
                   </div>
                 </div>
               </div>

               <div className="mt-10">
                {!user ? (
                  <Link to="/login" className="w-full flex justify-center py-4 bg-brand-blue hover:bg-[#0a4f80] text-white rounded-xl text-sm font-black uppercase tracking-wider transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                    Login to Apply
                  </Link>
                ) : user.role === 'admin' ? (
                  <div className="w-full text-center py-4 bg-slate-100 text-slate-500 rounded-2xl font-black border border-slate-200">
                    Admins cannot apply
                  </div>
                ) : (
                  <div>
                    {applyState.success ? (
                      <div className="w-full flex justify-center items-center py-4 bg-green-500 text-white rounded-2xl font-black shadow-lg">
                        <CheckCircle className="w-5 h-5 mr-2" /> Application Submitted!
                      </div>
                    ) : applyState.error ? (
                      <div className="w-full flex justify-center items-center py-4 bg-red-50 text-red-600 rounded-2xl font-black border border-red-200 text-sm md:text-base px-2 text-center">
                        {applyState.error}
                      </div>
                    ) : (
                      <button 
                        onClick={handleApply}
                        disabled={applyState.loading}
                        className="w-full flex justify-center py-4 bg-brand-blue hover:bg-[#0a4f80] text-white rounded-xl text-sm font-black uppercase tracking-wider transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-70 disabled:-translate-y-0 disabled:scale-100 disabled:shadow-none disabled:hover:bg-brand-blue"
                      >
                        {applyState.loading ? 'Applying...' : 'Apply Now'}
                      </button>
                    )}
                  </div>
                )}
               </div>
            </div>

            {/* Hiring Company Card */}
            <div className="bg-slate-900 rounded-[2rem] p-8 shadow-xl relative overflow-hidden flex flex-col">
              {/* Background accent ring */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 border-[20px] border-white/5 rounded-full blur-[2px]"></div>
              
              <h3 className="text-[10px] font-black text-white/50 uppercase tracking-widest mb-6 relative z-10">HIRING COMPANY</h3>
              
              <div className="flex items-center mb-6 relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mr-4 shrink-0 border border-white/10">
                   <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg leading-tight">Centennial Infotech</h4>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mt-1">CENTENNIAL PARTNER</p>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center text-white/80 text-sm font-medium">
                  <CheckCircle className="w-4 h-4 mr-3 text-blue-400" /> Verified Employer
                </div>
                <div className="flex items-center text-white/80 text-sm font-medium">
                  <Globe className="w-4 h-4 mr-3 text-blue-400" /> Global Recruitment via Centennial
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
