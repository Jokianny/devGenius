import React from 'react';
import { UserPlus, Search, CheckCircle, FileCheck, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onGetStarted: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onGetStarted }) => {
  const steps = [
    {
      num: '01',
      icon: <UserPlus className="w-6 h-6 text-[#082592]" />,
      title: 'Create Your Account',
      description: 'Register with your name and email in under 30 seconds. Your student dashboard is activated immediately.'
    },
    {
      num: '02',
      icon: <Search className="w-6 h-6 text-[#082592]" />,
      title: 'Explore Available Courses',
      description: 'Review syllabi, prerequisite requirements, project outcomes, and instructor credentials.'
    },
    {
      num: '03',
      icon: <CheckCircle className="w-6 h-6 text-[#082592]" />,
      title: 'Enrol in Your Preferred Course',
      description: 'Click Enrol to gain instant access to lesson materials, assignments, and practical exercises.'
    },
    {
      num: '04',
      icon: <FileCheck className="w-6 h-6 text-[#082592]" />,
      title: 'Learn, Submit & Get Graded',
      description: 'Complete hands-on assignments, submit files, and receive personalized grading and feedback from faculty.'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-[#082592] uppercase tracking-wider">
            Simple 4-Step Pathway
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#061A3A] tracking-tight mt-1">
            How DevGenius Academy Works
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            From zero experience to industry-ready engineer with structured guidance at every step.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((s, i) => (
            <div 
              key={s.num} 
              className="relative p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:bg-white hover:border-[#082592]/30 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center">
                    {s.icon}
                  </div>
                  <span className="font-heading font-extrabold text-2xl text-slate-300">
                    {s.num}
                  </span>
                </div>

                <h3 className="font-heading font-bold text-base text-slate-900 mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {s.description}
                </p>
              </div>

              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={onGetStarted}
            className="px-6 py-3 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            Start Your Journey Today
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
