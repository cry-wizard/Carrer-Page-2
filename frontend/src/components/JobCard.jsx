import { MapPin, Building2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => {
  return (
    <div className="group bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-premium transition-all duration-300 flex flex-col h-full border border-slate-100 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-6">
        <div className="w-12 h-12 bg-primary-50 text-brand-blue rounded-xl flex items-center justify-center">
          <Building2 size={24} strokeWidth={1.5} />
        </div>
        <span className="bg-slate-50 text-slate-500 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
          {job.type}
        </span>
      </div>

      <div className="mb-8 flex-grow">
        <h3 className="text-xl font-black text-slate-900 mb-1.5 leading-tight">
          {job.title}
        </h3>
        <p className="text-brand-blue text-xs font-black uppercase tracking-wider mb-6">
          CENTENNIAL INFOTECH
        </p>

        <div className="space-y-3">
          <div className="flex items-center text-slate-500 text-sm font-medium">
            <MapPin size={16} strokeWidth={2} className="mr-2 text-slate-400" />
            {job.location}
          </div>
          {job.salary && (
             <div className="flex items-center text-slate-900 text-sm font-black">
               <span className="text-slate-900 mr-2">$</span>
               {job.salary} <span className="text-slate-400 text-[10px] font-bold ml-1">/ Monthly</span>
             </div>
          )}
        </div>
      </div>

      <Link 
        to={`/jobs/${job._id}`}
        className="block w-full text-center py-4 bg-slate-50 group-hover:bg-brand-blue text-slate-900 group-hover:text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center"
      >
        VIEW DETAILS <ChevronRight className="w-4 h-4 ml-1" strokeWidth={3} />
      </Link>
    </div>
  );
};

export default JobCard;
