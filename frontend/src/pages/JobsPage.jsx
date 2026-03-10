import { useState, useEffect } from 'react';
import { Search, Briefcase, Filter } from 'lucide-react';
import api from '../utils/api';
import JobCard from '../components/JobCard';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filters
  const [filters, setFilters] = useState({
    type: '',
    department: '',
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.department) params.append('department', filters.department);

      const { data } = await api.get(`/jobs?${params.toString()}`);
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-brand-bg pb-24 pt-32">
      
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center px-6 mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 -z-10"></div>
        
        <div className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-brand-blue text-[10px] font-black tracking-widest uppercase mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-blue inline-block mr-2"></span>
          Discover your next career move
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
          Career <span className="text-brand-blue">Opportunities</span>
        </h1>
        
        <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
          Where talent learns, grows, and connects with opportunities at Centennial.
        </p>
      </div>

      {/* Interlocking Search Bar */}
      <div className="max-w-[900px] mx-auto px-6 mb-16 relative z-10">
        <div className="bg-white p-2 rounded-full shadow-premium flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-slate-50 border border-slate-50">
          
          <div className="flex-grow flex items-center pl-6 pr-4 py-3 w-full">
            <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
            <input 
              type="text" 
              placeholder="Search by role, company, or location..." 
              className="w-full bg-transparent border-none focus:outline-none text-slate-700 font-medium placeholder-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center px-6 py-3 w-full md:w-[220px] shrink-0 hover:bg-slate-50 transition-colors cursor-pointer">
            <Briefcase className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
            <select 
              name="department" 
              value={filters.department} 
              onChange={handleFilterChange}
              className="w-full bg-transparent border-none font-black text-slate-900 text-sm focus:outline-none appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              <option value="Software Development">Software Development</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
            </select>
          </div>

          <div className="flex items-center px-6 py-3 w-full md:w-[180px] shrink-0 pr-8 hover:bg-slate-50 transition-colors cursor-pointer rounded-r-full">
            <Filter className="w-4 h-4 text-slate-400 mr-3 shrink-0" />
            <select 
              name="type" 
              value={filters.type} 
              onChange={handleFilterChange}
              className="w-full bg-transparent border-none font-black text-slate-900 text-sm focus:outline-none appearance-none cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-blue mb-4"></div>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-[32px] shadow-sm border border-gray-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500 mb-6">We couldn't find any jobs matching your search.</p>
            <button 
              onClick={() => {setSearchTerm(''); setFilters({type: '', department: ''});}}
              className="mt-2 px-6 py-2.5 bg-blue-50 text-brand-blue font-bold rounded-full hover:bg-blue-100 transition text-sm"
            >
              View All Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
