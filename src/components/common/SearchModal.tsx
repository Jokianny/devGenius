import React, { useState } from 'react';
import { Search, X, BookOpen, ArrowRight, Star, Clock } from 'lucide-react';
import { Course } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onSelectCourse: (course: Course) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  courses,
  onSelectCourse
}) => {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = courses.filter(c => 
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase()) ||
    c.instructor_name.toLowerCase().includes(query.toLowerCase()) ||
    c.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-20 bg-[#061A3A]/75 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-slate-100 flex flex-col space-y-4 max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800">
            <Search className="w-5 h-5 text-[#082592]" />
            <span className="font-heading font-bold text-base">Search Courses & Syllabi</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type 'Python', 'React', 'Design', 'Database'..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:border-[#082592] focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="overflow-y-auto space-y-2 flex-1">
          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No matching courses found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            results.map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  onSelectCourse(c);
                  onClose();
                }}
                className="p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-[#F2F6FF]/50 transition-all flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-12 h-10 rounded-lg object-cover border border-slate-200"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-heading font-bold text-xs text-slate-900 group-hover:text-[#082592] transition-colors">
                      {c.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                      <span className="text-[#082592] font-semibold">{c.category}</span>
                      <span>·</span>
                      <span>{c.duration}</span>
                      <span>·</span>
                      <span>${c.price}.00</span>
                    </div>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#082592] group-hover:translate-x-1 transition-all" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
