import React, { useState } from 'react';
import { 
  X, Clock, BarChart3, Star, User as UserIcon, 
  CheckCircle2, ArrowRight, BookOpen, ShieldCheck, 
  Sparkles, Layers 
} from 'lucide-react';
import { Course, User } from '../../types';

interface CourseDetailsModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  isEnrolled: boolean;
  onEnrol: (courseId: string) => void;
  onGoToDashboard: () => void;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  course,
  isOpen,
  onClose,
  currentUser: _currentUser,
  isEnrolled,
  onEnrol,
  onGoToDashboard
}) => {
  const [activeTab, setActiveTab] = useState<'syllabus' | 'overview'>('syllabus');

  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#061A3A]/75 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="relative bg-[#061A3A] text-white p-6 sm:p-8 flex items-start justify-between">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold bg-[#F28C18] text-white px-2.5 py-0.5 rounded-md">
                {course.category}
              </span>
              <span className="text-xs text-slate-300">·</span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {course.duration}
              </span>
              <span className="text-xs text-slate-300">·</span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5" />
                {course.level}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white leading-tight">
              {course.title}
            </h2>

            <div className="flex items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-[#F28C18]" />
                <span className="text-white font-medium">{course.instructor_name}</span>
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-bold">{course.rating.toFixed(1)}</span>
                <span className="text-slate-400">({course.review_count} reviews)</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 sm:px-8 flex items-center gap-6">
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'syllabus'
                ? 'border-[#082592] text-[#082592]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Course Syllabus & Curriculum
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#082592] text-[#082592]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview & Outcomes
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700">
          {activeTab === 'syllabus' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100">
                <span className="font-semibold text-slate-700">Curriculum Breakdown</span>
                <span>{course.syllabus?.length || 4} Core Modules</span>
              </div>

              <div className="space-y-3">
                {course.syllabus?.map((module, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#082592] bg-blue-50 px-2 py-0.5 rounded-md">
                        Week {module.week}
                      </span>
                      <span className="text-[11px] text-slate-400">Practical Lab & Tasks</span>
                    </div>

                    <h4 className="font-heading font-bold text-sm text-slate-900">
                      {module.title}
                    </h4>

                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {module.topics.map((t, tid) => (
                        <li key={tid} className="flex items-center gap-1.5 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-5 text-xs sm:text-sm">
              <div>
                <h4 className="font-heading font-bold text-sm text-slate-900 mb-2">
                  Course Description
                </h4>
                <p className="text-slate-600 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#F28C18]" />
                    What You Will Build
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li>• Deployable real-world projects</li>
                    <li>• Portfolio-ready code repository</li>
                    <li>• Automated test suites & documentation</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Prerequisites
                  </div>
                  <p className="text-xs text-slate-600">
                    A laptop with an internet connection. No prior programming background is required for beginner tracks.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 sm:px-8 border-t border-slate-200 flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-slate-400">Total Tuition</div>
            <div className="text-2xl font-heading font-extrabold text-[#082592]">
              ${course.price}.00
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="py-2.5 px-4 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            {isEnrolled ? (
              <button
                onClick={() => {
                  onClose();
                  onGoToDashboard();
                }}
                className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Go to Student Portal
              </button>
            ) : (
              <button
                onClick={() => onEnrol(course.id)}
                className="py-2.5 px-6 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Enrol Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
