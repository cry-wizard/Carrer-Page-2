import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building, MapPin, Clock, Briefcase, FileText } from 'lucide-react';
import api from '../utils/api';

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await api.get('/applications/my/all');
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'reviewed': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-200';
      case 'hired': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            My Applications
          </h1>
          <p className="text-gray-500 text-lg">
            Track the status of your job applications.
          </p>
        </div>

        {applications.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center"
          >
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-blue-300" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Applications Yet</h3>
            <p className="text-gray-500 max-w-md mx-auto text-lg mb-8">
              You haven't applied to any jobs yet. Browse our job listings and find your next opportunity!
            </p>
            <a href="/" className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">
              Browse Jobs
            </a>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {applications.map((app, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={app._id}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start md:items-center gap-6">
                  <div className="hidden md:flex w-16 h-16 bg-blue-50 rounded-2xl items-center justify-center text-blue-600 flex-shrink-0">
                    <Building size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {app.jobId ? app.jobId.title : 'Job no longer exists'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium">
                      {app.jobId && (
                        <>
                          <span className="flex items-center"><Briefcase size={16} className="mr-1.5" /> {app.jobId.department}</span>
                          <span className="flex items-center"><MapPin size={16} className="mr-1.5" /> {app.jobId.location}</span>
                        </>
                      )}
                      <span className="flex items-center"><Clock size={16} className="mr-1.5" /> Applied on {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end gap-3">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-bold border uppercase tracking-wider ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                  {app.jobId && (
                    <a href={`/jobs/${app.jobId._id}`} className="text-sm text-blue-600 font-semibold hover:text-blue-800 flex items-center transition-colors">
                      View Job Listing <span className="ml-1">→</span>
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
