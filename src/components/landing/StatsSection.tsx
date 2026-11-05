import React from 'react';
import { Users, BookOpen, Award, CheckCircle2 } from 'lucide-react';
import { PlatformStats } from '../../types';

interface StatsSectionProps {
  stats: PlatformStats;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
    <section className="bg-gradient-to-r from-[#061A3A] via-[#082592] to-[#1746C5] py-16 text-white border-y border-white/10 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#F28C18] uppercase tracking-wider">
            Live Platform Metrics
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white mt-1">
            Real Impact at DevGenius Academy
          </h2>
          <p className="text-xs text-blue-100/80 mt-1">
            Dynamically fetched from our active database records.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Stat 1: Registered Students (Strictly student role) */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-[#F28C18] flex items-center justify-center mb-3">
              <Users className="w-6 h-6 text-[#F28C18]" />
            </div>
            <div className="text-3xl sm:text-4xl font-heading font-extrabold text-white tabular-nums tracking-tight">
              {stats.totalStudents}
            </div>
            <div className="text-xs font-semibold text-blue-100 mt-1">
              Registered Students
            </div>
            <div className="text-[10px] text-blue-200/60 mt-0.5">
              Verified active learners
            </div>
          </div>

          {/* Stat 2: Available Courses */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-[#F28C18] flex items-center justify-center mb-3">
              <BookOpen className="w-6 h-6 text-[#F28C18]" />
            </div>
            <div className="text-3xl sm:text-4xl font-heading font-extrabold text-white tabular-nums tracking-tight">
              {stats.totalCourses}
            </div>
            <div className="text-xs font-semibold text-blue-100 mt-1">
              Available Courses
            </div>
            <div className="text-[10px] text-blue-200/60 mt-0.5">
              Across tech tracks
            </div>
          </div>

          {/* Stat 3: Total Enrolments */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-[#F28C18] flex items-center justify-center mb-3">
              <Award className="w-6 h-6 text-[#F28C18]" />
            </div>
            <div className="text-3xl sm:text-4xl font-heading font-extrabold text-white tabular-nums tracking-tight">
              {stats.totalEnrolments}
            </div>
            <div className="text-xs font-semibold text-blue-100 mt-1">
              Course Enrolments
            </div>
            <div className="text-[10px] text-blue-200/60 mt-0.5">
              In progress & active
            </div>
          </div>

          {/* Stat 4: Graded Submissions / Completed */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-[#F28C18] flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6 text-[#F28C18]" />
            </div>
            <div className="text-3xl sm:text-4xl font-heading font-extrabold text-white tabular-nums tracking-tight">
              {stats.completedGraded}
            </div>
            <div className="text-xs font-semibold text-blue-100 mt-1">
              Graded Submissions
            </div>
            <div className="text-[10px] text-blue-200/60 mt-0.5">
              With instructor feedback
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
