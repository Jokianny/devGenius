import React from 'react';
import { Star, Mail, Award, CheckCircle } from 'lucide-react';
import { Instructor } from '../../types';

interface InstructorsSectionProps {
  instructors: Instructor[];
}

export const InstructorsSection: React.FC<InstructorsSectionProps> = ({ instructors }) => {
  return (
    <section id="instructors" className="py-20 bg-[#F2F6FF]/60 border-t border-blue-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#082592] uppercase tracking-wider">
            World-Class Mentors
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#061A3A] tracking-tight mt-1">
            Meet Our Top Instructors
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Learn from industry veterans with proven engineering leadership across multinational technology firms.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {instructors.map((inst) => (
            <div
              key={inst.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-1"
            >
              {/* Photo */}
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <img
                  src={inst.avatar}
                  alt={inst.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] font-bold text-slate-800 shadow-xs flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{inst.rating ? inst.rating.toFixed(1) : '4.9'}</span>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900 group-hover:text-[#082592] transition-colors">
                    {inst.name}
                  </h3>
                  <div className="text-xs font-semibold text-[#F28C18] mt-0.5">
                    {inst.role_title}
                  </div>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {inst.bio}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-slate-700 font-medium">
                    <Award className="w-3.5 h-3.5 text-[#082592]" />
                    {inst.specialization}
                  </span>
                  <a
                    href={`mailto:${inst.email}`}
                    className="p-1 rounded text-slate-400 hover:text-[#082592] transition-colors"
                    title={`Contact ${inst.name}`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
