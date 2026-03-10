import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Users, Briefcase, MapPin, DollarSign, X } from 'lucide-react';
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
    title: '', department: '', location: '', type: 'Full-time', description: '', salary: ''
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
        title: job.title, department: job.department, location: job.location,
        type: job.type, description: job.description, salary: job.salary
      });
    } else {
      setCurrentJob(null);
      setFormData({ title: '', department: '', location: '', type: 'Full-time', description: '', salary: '' });
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
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500 font-medium">Manage job postings and view applications.</p>
          </div>
          <button 
            onClick={() => handleOpenJobModal()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center transition shadow-lg shadow-blue-500/30"
          >
            <Plus className="mr-2 w-5 h-5" /> Post New Job
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
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
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100 text-gray-500 text-sm uppercase tracking-wider">
                    <th className="p-6 font-semibold">Job Title</th>
                    <th className="p-6 font-semibold">Department</th>
                    <th className="p-6 font-semibold">Location</th>
                    <th className="p-6 font-semibold">Posted On</th>
                    <th className="p-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-6 font-bold text-gray-900">
                        {job.title}
                        <div className="text-xs font-semibold text-blue-600 bg-blue-50 inline-block px-2 py-1 rounded ml-3">
                          {job.type}
                        </div>
                      </td>
                      <td className="p-6 text-gray-600 font-medium">{job.department}</td>
                      <td className="p-6 text-gray-600 font-medium flex items-center"><MapPin className="w-4 h-4 mr-2 text-gray-400" />{job.location}</td>
                      <td className="p-6 text-gray-500 font-medium">{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td className="p-6 text-right space-x-3">
                        <button 
                          onClick={() => handleViewApplicants(job)}
                          className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg transition-colors inline-block"
                          title="View Applicants"
                        >
                          <Users size={20} />
                        </button>
                        <button 
                          onClick={() => handleOpenJobModal(job)}
                          className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors inline-block"
                          title="Edit Job"
                        >
                          <Edit size={20} />
                        </button>
                        <button 
                          onClick={() => handleDeleteJob(job._id)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors inline-block"
                          title="Delete Job"
                        >
                          <Trash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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
              className="bg-white rounded-3xl shadow-2xl z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center p-8 border-b border-gray-100 sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-bold text-gray-900">{currentJob ? 'Edit Job Posting' : 'Create New Job Listing'}</h2>
                <button onClick={() => setIsJobModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 rounded-full transition-colors">
                  <X />
                </button>
              </div>
              
              <form onSubmit={handleSaveJob} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Job Title</label>
                    <input 
                      required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition" 
                      placeholder="e.g. Senior Frontend Engineer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Department</label>
                    <input 
                      required type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition" 
                      placeholder="e.g. Engineering"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                    <input 
                      required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition" 
                      placeholder="e.g. Remote, San Francisco"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Job Type</label>
                    <select 
                      value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition appearance-none"
                    >
                      <option>Full-time</option>
                      <option>Part-time</option>
                      <option>Contract</option>
                      <option>Internship</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Expected Salary</label>
                    <input 
                      type="text" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition" 
                      placeholder="e.g. $100,000 - $140,000"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Job Description</label>
                    <textarea 
                      required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition h-40 resize-y" 
                      placeholder="Detailed responsibilities and requirements..."
                    ></textarea>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setIsJobModalOpen(false)} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-50 rounded-xl mr-4 transition">
                    Cancel
                  </button>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-500/30">
                    {currentJob ? 'Update Job' : 'Post Job'}
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
