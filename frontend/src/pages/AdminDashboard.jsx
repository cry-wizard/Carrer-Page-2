import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Users, Briefcase, MapPin, DollarSign, X, Clock, UserPlus } from 'lucide-react';
import api from '../utils/api';

export default function AdminDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isApplicantsModalOpen, setIsApplicantsModalOpen] = useState(false);
  
  // Current edited/viewed selection
  const [currentJob, setCurrentJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '', department: '', companyName: 'Centennial Infotech', location: '', type: 'Full-time', 
    workMode: 'Remote', minSalary: '', maxSalary: '', expRequired: '1', openings: 1, 
    description: '', showRequirements: false, showResponsibilities: false, 
    requirements: '', responsibilities: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/jobs');
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenJobModal = (job = null) => {
    if (job) {
      setCurrentJob(job);
      setFormData({
        title: job.title || '', department: job.department || '', companyName: job.companyName || 'Centennial Infotech', 
        location: job.location || '', type: job.type || 'Full-time', workMode: job.workMode || 'Remote',
        minSalary: job.minSalary || '', maxSalary: job.maxSalary || '',
        expRequired: job.expRequired || '1', openings: job.openings || 1,
        description: job.description || '', showRequirements: job.showRequirements || false,
        showResponsibilities: job.showResponsibilities || false, requirements: job.requirements || '',
        responsibilities: job.responsibilities || ''
      });
    } else {
      setCurrentJob(null);
      setFormData({ 
        title: '', department: '', companyName: 'Centennial Infotech', location: '', type: 'Full-time', 
        workMode: 'Remote', minSalary: '', maxSalary: '', expRequired: '1', openings: 1, 
        description: '', showRequirements: false, showResponsibilities: false, 
        requirements: '', responsibilities: ''
      });
    }
    setIsJobModalOpen(true);
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();
    try {
      if (currentJob) {
        await api.put(`/jobs/${currentJob._id}`, formData);
      } else {
        await api.post('/jobs', formData);
      }
      setIsJobModalOpen(false);
      fetchJobs();
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await api.delete(`/jobs/${id}`);
        fetchJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    }
  };

  const handleViewApplicants = async (job) => {
    setCurrentJob(job);
    setIsApplicantsModalOpen(true);
    setLoadingApplicants(true);
    try {
      const { data } = await api.get(`/applications/job/${job._id}`);
      setApplicants(data);
    } catch (error) {
      console.error('Error fetching applicants:', error);
    } finally {
      setLoadingApplicants(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-24 md:px-12 md:py-32 relative flex justify-center">
      <div className="w-full max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Recruiter Dashboard</h1>
            <p className="text-slate-400 font-medium text-sm">Manage your job listings and track applications</p>
          </div>
          <button 
            onClick={() => handleOpenJobModal()}
            className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold flex items-center shadow-sm border border-slate-100 hover:shadow-md transition"
          >
            <Plus className="mr-2 w-5 h-5 text-slate-900" /> Post New Job
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-16 text-center">
             <h3 className="text-2xl font-bold text-gray-900 mb-2">No Jobs Posted</h3>
             <p className="text-gray-500 mb-6">You haven't posted any jobs yet.</p>
             <button 
               onClick={() => handleOpenJobModal()}
               className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-6 py-3 rounded-xl font-bold inline-flex items-center transition"
             >
               <Plus className="mr-2 w-5 h-5" /> Create First Job
             </button>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 flex items-center">
                <div className="w-14 h-14 bg-blue-50 text-brand-blue rounded-2xl flex items-center justify-center mr-6">
                  <Briefcase size={28} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">ACTIVE LISTINGS</p>
                  <h2 className="text-3xl font-black text-slate-900">{jobs.length}</h2>
                </div>
              </div>
              <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 flex items-center">
                <div className="w-14 h-14 bg-purple-50 text-purple-500 rounded-2xl flex items-center justify-center mr-6">
                  <Users size={28} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">TOTAL CANDIDATES</p>
                  <h2 className="text-3xl font-black text-slate-900">{jobs.reduce((acc, job) => acc + (job.applicantCount || 0), 0)}</h2>
                </div>
              </div>
              <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-slate-100 flex items-center">
                <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mr-6">
                  <Clock size={28} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">TIME TO HIRE</p>
                  <h2 className="text-3xl font-black text-slate-900">12d</h2>
                </div>
              </div>
            </div>

            {/* Jobs List */}
            <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden text-sm mb-10">
              <div className="p-8 pb-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">Your Job Postings</h2>
              </div>
              <div className="overflow-x-auto p-4 pt-0">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 text-[10px] uppercase tracking-widest font-black">
                      <th className="p-4 font-black w-1/3">JOB DETAILS</th>
                      <th className="p-4 font-black">COMPENSATION</th>
                      <th className="p-4 font-black">STATUS</th>
                      <th className="p-4 font-black">TYPE</th>
                      <th className="p-4 font-black">POSTED ON</th>
                      <th className="p-4 font-black text-right pr-6">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {jobs.map((job) => (
                      <tr key={job._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="p-4">
                          <div className="font-bold text-slate-900 text-sm mb-1">{job.title}</div>
                          <div className="text-[11px] text-slate-400">JOB{job._id.substring(job._id.length - 4).toUpperCase()} • {job.department}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-900 text-sm">{job.salary || 'N/A'}</div>
                        </td>
                        <td className="p-4">
                          <span className="bg-green-50 text-green-600 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                            OPEN
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-900 text-[13px] mb-1">{job.type}</div>
                          <div className="text-[11px] text-slate-400">{job.location}</div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-slate-900 text-sm">{new Date(job.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="p-4 text-right pr-4 space-x-2 whitespace-nowrap">
                           <button 
                             onClick={() => handleViewApplicants(job)}
                             className="text-slate-400 hover:text-slate-900 p-2 transition-colors inline-flex items-center"
                             title="View Applicants"
                           >
                             <UserPlus size={18} strokeWidth={2} />
                             <span className="text-[10px] ml-1 font-bold">{job.applicantCount || 0}</span>
                           </button>
                           <button 
                             onClick={() => handleOpenJobModal(job)}
                             className="text-slate-400 hover:text-blue-600 p-2 transition-colors inline-block"
                             title="Edit Job"
                           >
                             <Edit size={18} strokeWidth={2} />
                           </button>
                           <button 
                             onClick={() => handleDeleteJob(job._id)}
                             className="text-slate-400 hover:text-red-600 p-2 transition-colors inline-block"
                             title="Delete Job"
                           >
                             <Trash2 size={18} strokeWidth={2} />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modern Job Creation/Edit Modal */}
      <AnimatePresence>
        {isJobModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
              onClick={() => setIsJobModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl z-50 w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col"
            >
              <div className="flex justify-between items-start p-8 pb-6 border-b border-slate-100 bg-white sticky top-0 z-10">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 mb-1">{currentJob ? 'Refine Job Listing' : 'Create New Opportunity'}</h2>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">{currentJob ? `ID: JOB${currentJob._id?.substring(currentJob._id.length - 4).toUpperCase()}` : 'Draft your next stellar posting'}</p>
                </div>
                <button type="button" onClick={() => setIsJobModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>
              
              <form onSubmit={handleSaveJob} className="p-8 space-y-12 flex-grow">
                
                {/* 1. BASIC INFORMATION */}
                <div className="space-y-6">
                  <div className="flex items-center text-slate-900 font-black text-xs uppercase tracking-widest mb-6 border-transparent">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center mr-3">
                      <Briefcase size={16} strokeWidth={2.5} />
                    </div>
                    1. Basic Information
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2">Job Title</label>
                      <input 
                        required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-50 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-brand-blue/5 transition-all" 
                        placeholder="e.g. Senior Frontend Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2">Company Name</label>
                      <input 
                        required type="text" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-50 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-brand-blue/5 transition-all" 
                        placeholder="Centennial Partner Name"
                      />
                    </div>
                    <div className="md:col-span-2">
                       <label className="block text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2">Job Role / Category</label>
                       <input 
                         required type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}
                         className="w-full bg-slate-50 border border-slate-50 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-brand-blue/5 transition-all" 
                         placeholder="Software Development"
                       />
                    </div>
                  </div>
                </div>

                {/* 2. DETAILS & LOGISTICS */}
                <div className="space-y-6">
                  <div className="flex items-center text-slate-900 font-black text-xs uppercase tracking-widest mb-6 border-t border-slate-100 pt-10">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center mr-3">
                      <MapPin size={16} strokeWidth={2.5} />
                    </div>
                    2. Details & Logistics
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2">Primary Location</label>
                        <input 
                          required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-50 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-brand-blue/5 transition-all" 
                          placeholder="City, State"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2">Job Type</label>
                          <select 
                            value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-50 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-brand-blue/5 transition-all appearance-none"
                          >
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Contract</option>
                            <option>Internship</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2">Work Mode</label>
                          <select 
                            value={formData.workMode} onChange={e => setFormData({...formData, workMode: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-50 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-brand-blue/5 transition-all appearance-none"
                          >
                            <option>Remote</option>
                            <option>On-site</option>
                            <option>Hybrid</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2">Exp. Required (Yrs)</label>
                          <input 
                            type="text" value={formData.expRequired} onChange={e => setFormData({...formData, expRequired: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-50 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-brand-blue/5 transition-all" 
                            placeholder="Years"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2">Openings</label>
                          <input 
                            type="number" value={formData.openings} onChange={e => setFormData({...formData, openings: parseInt(e.target.value)})}
                            className="w-full bg-slate-50 border border-slate-50 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-brand-blue/5 transition-all" 
                            placeholder="1" min="1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2">Annual Compensation Range</label>
                      <div className="flex space-x-3 mb-4">
                         <div className="w-1/3 bg-slate-50 border border-slate-50 rounded-xl px-2 py-3.5 flex justify-center items-center">
                            <span className="text-sm font-black text-slate-900">₹ INR</span>
                         </div>
                         <input 
                           type="text" value={formData.minSalary} onChange={e => setFormData({...formData, minSalary: e.target.value})}
                           className="w-1/3 bg-slate-50 border border-slate-50 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-brand-blue/5 transition-all text-center" 
                           placeholder="Min"
                         />
                         <input 
                           type="text" value={formData.maxSalary} onChange={e => setFormData({...formData, maxSalary: e.target.value})}
                           className="w-1/3 bg-slate-50 border border-slate-50 rounded-xl px-4 py-3.5 text-sm font-bold text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-blue-100 focus:ring-4 focus:ring-brand-blue/5 transition-all text-center" 
                           placeholder="Max"
                         />
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 leading-tight">Leave blank if compensation is undefined or commission-based.</p>
                    </div>
                  </div>
                </div>

                {/* 3. JOB CONTENT */}
                <div className="space-y-6">
                  <div className="flex items-center text-slate-900 font-black text-xs uppercase tracking-widest mb-6 border-t border-slate-100 pt-10">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center mr-3">
                      <span className="font-extrabold text-[10px] leading-none text-orange-600">✓</span>
                    </div>
                    3. Job Content
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-6 mb-8">
                    <div className="flex items-center space-x-4 bg-slate-50/50 px-5 py-3 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Show Requirements Section?</span>
                      <div className="flex bg-white rounded-lg p-1 shadow-[0_0_10px_rgba(0,0,0,0.03)] border border-slate-100">
                        <button type="button" onClick={() => setFormData({...formData, showRequirements: true})} className={`px-4 py-1.5 rounded-[6px] text-[10px] font-black uppercase tracking-wider transition-colors ${formData.showRequirements ? 'bg-brand-blue text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Yes</button>
                        <button type="button" onClick={() => setFormData({...formData, showRequirements: false})} className={`px-4 py-1.5 rounded-[6px] text-[10px] font-black uppercase tracking-wider transition-colors ${!formData.showRequirements ? 'bg-brand-blue text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>No</button>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 bg-slate-50/50 px-5 py-3 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Show Responsibilities Section?</span>
                      <div className="flex bg-white rounded-lg p-1 shadow-[0_0_10px_rgba(0,0,0,0.03)] border border-slate-100">
                        <button type="button" onClick={() => setFormData({...formData, showResponsibilities: true})} className={`px-4 py-1.5 rounded-[6px] text-[10px] font-black uppercase tracking-wider transition-colors ${formData.showResponsibilities ? 'bg-brand-blue text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Yes</button>
                        <button type="button" onClick={() => setFormData({...formData, showResponsibilities: false})} className={`px-4 py-1.5 rounded-[6px] text-[10px] font-black uppercase tracking-wider transition-colors ${!formData.showResponsibilities ? 'bg-brand-blue text-white shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>No</button>
                      </div>
                    </div>
                  </div>

                  {/* Rich Text Areas */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2">Full Job Description</label>
                      <div className="border border-slate-200 rounded-[1rem] overflow-hidden focus-within:border-brand-blue/30 focus-within:ring-4 focus-within:ring-brand-blue/5 transition-all bg-white shadow-sm">
                        {/* Fake Toolbar */}
                        <div className="bg-slate-50/50 border-b border-slate-100 px-5 py-3 flex items-center space-x-5 text-slate-500">
                          <span className="text-xs font-bold font-serif text-slate-600">Normal</span>
                          <div className="flex space-x-4">
                            <span className="font-serif font-black text-sm">B</span>
                            <span className="font-serif italic text-sm">I</span>
                            <span className="font-serif underline text-sm">U</span>
                          </div>
                          <div className="flex space-x-3 text-lg leading-none cursor-default">
                            <span>≡</span>
                            <span>=</span>
                          </div>
                        </div>
                        <textarea 
                          required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                          className="w-full bg-white px-6 py-5 text-sm font-medium text-slate-700 placeholder-slate-400 outline-none h-48 resize-y leading-relaxed" 
                          placeholder="Describe the overall mission and value proposition..."
                        ></textarea>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className={formData.showRequirements ? "opacity-100" : "opacity-50 pointer-events-none"}>
                        <label className="block text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2">Required Qualifications</label>
                        <div className="border border-slate-200 rounded-[1rem] overflow-hidden focus-within:border-brand-blue/30 focus-within:ring-4 focus-within:ring-brand-blue/5 transition-all bg-white shadow-sm">
                          <div className="bg-slate-50/50 border-b border-slate-100 px-4 py-2.5 flex items-center space-x-4 text-slate-500">
                            <span className="font-serif font-black text-sm">B</span>
                            <span className="font-serif italic text-sm">I</span>
                            <span className="font-serif underline text-sm">U</span>
                          </div>
                          <textarea 
                            value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})}
                            className="w-full bg-white px-5 py-4 text-sm font-medium text-slate-700 placeholder-slate-400 outline-none h-28 resize-y leading-relaxed" 
                            placeholder="Skills, experience, and certifications..."
                          ></textarea>
                        </div>
                      </div>

                      <div className={formData.showResponsibilities ? "opacity-100" : "opacity-50 pointer-events-none"}>
                        <label className="block text-[10px] font-black text-slate-400 tracking-widest uppercase mb-2">Key Responsibilities</label>
                        <div className="border border-slate-200 rounded-[1rem] overflow-hidden focus-within:border-brand-blue/30 focus-within:ring-4 focus-within:ring-brand-blue/5 transition-all bg-white shadow-sm">
                          <div className="bg-slate-50/50 border-b border-slate-100 px-4 py-2.5 flex items-center space-x-4 text-slate-500">
                            <span className="font-serif font-black text-sm">B</span>
                            <span className="font-serif italic text-sm">I</span>
                            <span className="font-serif underline text-sm">U</span>
                          </div>
                          <textarea 
                            value={formData.responsibilities} onChange={e => setFormData({...formData, responsibilities: e.target.value})}
                            className="w-full bg-white px-5 py-4 text-sm font-medium text-slate-700 placeholder-slate-400 outline-none h-28 resize-y leading-relaxed" 
                            placeholder="Day-to-day tasks and expectations..."
                          ></textarea>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
                
                <div className="pt-8 mb-4">
                  <button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue-hover text-white py-4 rounded-[1rem] font-black text-xs uppercase tracking-widest transition shadow-xl shadow-brand-blue/20 hover:shadow-2xl hover:shadow-brand-blue/30 hover:-translate-y-0.5 flex justify-center items-center">
                    {currentJob ? 'Update Listing →' : 'Publish Opportunity →'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Applicants Modal */}
      <AnimatePresence>
        {isApplicantsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
              onClick={() => setIsApplicantsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl z-50 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-center p-8 border-b border-gray-100 bg-white">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Applicants for {currentJob?.title}</h2>
                  <p className="text-gray-500 font-medium">{applicants.length} Total Applications</p>
                </div>
                <button onClick={() => setIsApplicantsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full transition-colors">
                  <X />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto bg-slate-50/50 flex-grow">
                {loadingApplicants ? (
                   <div className="flex justify-center p-12">
                     <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                   </div>
                ) : applicants.length === 0 ? (
                  <div className="text-center p-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg font-medium">No applicants for this position yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applicants.map((app) => (
                      <div key={app._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center text-indigo-700 font-extrabold text-lg shadow-inner">
                            {app.userId.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{app.userId.name}</h4>
                            <a href={`mailto:${app.userId.email}`} className="text-sm text-blue-600 hover:underline">{app.userId.email}</a>
                            <p className="text-xs text-gray-400 font-medium mt-1">Applied {new Date(app.createdAt).toLocaleString()}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            app.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' : 'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
