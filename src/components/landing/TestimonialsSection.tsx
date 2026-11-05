import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "DevGenius Academy transformed my coding journey. The full-stack curriculum was so structured, and the assignment grading feedback from Dr. David helped me land my first junior software engineering position.",
      author: "Jessica Miller",
      track: "Full-Stack Web Development Graduate",
      company: "Now at Fintech Labs",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      rating: 5
    },
    {
      quote: "The Python & AI module made complex data structures crystal clear. Submitting real code projects and receiving line-by-line instructor critiques gave me immense confidence.",
      author: "Kofi Boateng",
      track: "Python & Data Science Graduate",
      company: "Data Analyst at HealthTech",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      rating: 5
    },
    {
      quote: "From wireframes to interactive design systems, Amina's Figma classes were world-class. The student registration portal made tracking my submissions effortless.",
      author: "Chiamaka Eze",
      track: "UI/UX Design Systems Graduate",
      company: "Product Designer at PayFlow",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
      rating: 5
    }
  ];

  return (
    <section className="py-20 bg-[#F2F6FF]/60 border-t border-blue-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold text-[#082592] uppercase tracking-wider">
            Student Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#061A3A] tracking-tight mt-1">
            What Our Students Say
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Sample alumni reviews illustrating genuine student learning outcomes and career advancement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-7 border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: t.rating }).map((_, r) => (
                      <Star key={r} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-[#082592]/15" />
                </div>

                <p className="text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-11 h-11 rounded-full object-cover border border-slate-200"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-xs font-heading font-bold text-slate-900">
                    {t.author}
                  </h4>
                  <div className="text-[11px] text-[#082592] font-medium">
                    {t.track}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
