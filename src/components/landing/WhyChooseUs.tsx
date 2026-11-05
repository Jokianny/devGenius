import React from 'react';
import { 
  Award, Briefcase, Clock, Compass, 
  GraduationCap, Headphones, CheckCircle2, ShieldCheck 
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const benefits = [
    {
      icon: <GraduationCap className="w-5 h-5 text-[#082592]" />,
      title: 'Expert Instructors',
      description: 'Learn directly from seasoned software architects and industry leaders with real-world production experience.'
    },
    {
      icon: <Briefcase className="w-5 h-5 text-[#082592]" />,
      title: 'Practical Learning',
      description: 'Every lesson centers around building deployable applications, real portfolios, and hands-on assignments.'
    },
    {
      icon: <Clock className="w-5 h-5 text-[#082592]" />,
      title: 'Flexible Learning',
      description: 'Study at your own pace with 24/7 access to curriculum materials, video walkthroughs, and project files.'
    },
    {
      icon: <Award className="w-5 h-5 text-[#082592]" />,
      title: 'Quality Education',
      description: 'Curated university-grade syllabi optimized for modern tech stacks, standard frameworks, and clean code.'
    },
    {
      icon: <Compass className="w-5 h-5 text-[#082592]" />,
      title: 'Career Development',
      description: 'Get interview coaching, resume reviews, portfolio polish, and direct referrals to top tech companies.'
    },
    {
      icon: <Headphones className="w-5 h-5 text-[#082592]" />,
      title: 'Student Support',
      description: 'Dedicated teaching assistants, collaborative peer community, and timely assignment grading feedback.'
    }
  ];

  return (
    <section id="why-choose-us" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: 6 Benefits Grid */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-xs font-bold text-[#082592] uppercase tracking-wider">
                Excellence in Tech Training
              </span>
              <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#061A3A] tracking-tight mt-1">
                Why Choose DevGenius Academy?
              </h2>
              <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                We combine academic rigor with modern industry practices to give you the competitive edge required in today&apos;s digital economy.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#F2F6FF]/60 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                    {b.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-heading font-bold text-slate-900 mb-1">
                      {b.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Instructor Visual & Badge */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Backing Card */}
              <div className="absolute -inset-3 bg-gradient-to-tr from-[#082592] to-[#F28C18] rounded-3xl -rotate-2 opacity-80 shadow-xl"></div>
              
              <div className="relative rounded-2xl overflow-hidden bg-white border-4 border-white shadow-2xl aspect-4/5">
                <img
                  src="/src/assets/images/instructor_lead_1793881080008.jpg"
                  alt="Dr. David Adeleke, Lead Instructor at DevGenius Academy"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />

                {/* Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#061A3A]/90 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                  <div className="text-xs font-semibold text-[#F28C18]">Head of Faculty</div>
                  <div className="text-lg font-heading font-bold">Dr. David Adeleke</div>
                  <div className="text-xs text-slate-300">Mentored 8,000+ developers globally</div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-blue-100 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#082592] text-white flex items-center justify-center font-heading font-extrabold text-xl">
                  15+
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900 leading-tight">Years of Excellence</div>
                  <div className="text-[11px] text-slate-500">In Tech Mentorship</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
