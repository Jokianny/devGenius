import React from 'react';
import { ArrowRight, BookOpen, Star, Users, CheckCircle, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onExploreCourses: () => void;
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCourses,
  onGetStarted
}) => {
  return (
    <section className="relative overflow-hidden bg-[#F2F6FF] pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-blue-100/60">
      {/* Decorative ambient elements */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none -z-0"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-orange-100/40 rounded-full blur-3xl pointer-events-none -z-0"></div>

      {/* Decorative Dotted Matrix */}
      <div className="absolute right-12 top-24 hidden lg:grid grid-cols-6 gap-2 opacity-25 pointer-events-none">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#082592]" />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline and Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-100 text-[#082592] text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#F28C18]" />
              <span>Best Online Education</span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-heading font-extrabold text-[#061A3A] tracking-tight leading-[1.12] text-balance">
              Build Your Future With{' '}
              <span className="text-[#082592]">DevGenius</span>{' '}
              <span className="relative inline-block text-[#1746C5]">
                Academy
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#F28C18]" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0,8 Q50,0 100,8" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Gain practical digital skills, learn from experienced instructors, and develop the expertise you need to succeed in today&apos;s technology-driven world.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExploreCourses}
                className="px-6 py-3.5 bg-[#082592] hover:bg-[#061A3A] text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-900/15 hover:shadow-xl transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#F28C18]" />
                Explore Courses
              </button>
              <button
                onClick={onGetStarted}
                className="px-6 py-3.5 bg-[#F28C18] hover:bg-[#d9770e] text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust Markers Bar */}
            <div className="pt-6 border-t border-blue-200/60 flex flex-wrap items-center gap-6 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-800">Job-Ready Curriculum</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-800">1-on-1 Code Reviews</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-800">Verified Certificates</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Graphic and Floating Badges */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Backing Circular Organic Blue Shape */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#082592] to-[#1746C5] rounded-[36px] rotate-3 opacity-95 shadow-2xl shadow-blue-900/30"></div>
              
              {/* Image Frame */}
              <div className="relative rounded-[32px] overflow-hidden bg-white shadow-xl aspect-4/3 sm:aspect-square lg:aspect-4/3 border-4 border-white">
                <img
                  src="/src/assets/images/hero_student_1793881077112.jpg"
                  alt="DevGenius Academy Student learning on campus with laptop"
                  className="w-full h-full object-cover object-top hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Floating Card 1: Active Learners (Left Top) */}
              <div className="absolute -top-4 -left-6 sm:-left-8 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-blue-50 flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#082592] flex items-center justify-center font-bold">
                  <Users className="w-5 h-5 text-[#082592]" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900 leading-tight">20,000+</div>
                  <div className="text-[11px] text-slate-500 font-medium">Active Learners</div>
                  <div className="flex -space-x-1.5 mt-1">
                    <div className="w-5 h-5 rounded-full bg-blue-500 border-2 border-white text-[8px] text-white flex items-center justify-center font-bold">SM</div>
                    <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-white text-[8px] text-white flex items-center justify-center font-bold">EO</div>
                    <div className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white text-[8px] text-white flex items-center justify-center font-bold">ZB</div>
                    <div className="w-5 h-5 rounded-full bg-[#082592] border-2 border-white text-[8px] text-white flex items-center justify-center font-bold">+</div>
                  </div>
                </div>
              </div>

              {/* Floating Card 2: 95% Success Rate (Right Bottom) */}
              <div className="absolute -bottom-5 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-blue-50 flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Star className="w-5 h-5 text-[#F28C18] fill-[#F28C18]" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-slate-900 leading-tight">95%</div>
                  <div className="text-[11px] text-slate-500 font-medium">Career Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
