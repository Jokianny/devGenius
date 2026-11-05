import React from 'react';
import { Calendar, Clock, MapPin, ArrowRight, ExternalLink } from 'lucide-react';

export const WorkshopsAndBlog: React.FC = () => {
  const events = [
    {
      day: '25',
      month: 'MAY',
      title: 'Full-Stack Web Architecture Workshop',
      time: '10:00 AM – 01:00 PM GMT',
      type: 'Live Virtual Lab',
      speaker: 'Dr. David Adeleke'
    },
    {
      day: '05',
      month: 'JUN',
      title: 'AI & Python Data Science Seminar',
      time: '02:00 PM – 05:00 PM GMT',
      type: 'Interactive Masterclass',
      speaker: 'Dr. Marcus Chen'
    },
    {
      day: '15',
      month: 'JUN',
      title: 'Design Systems & Figma Prototyping',
      time: '11:00 AM – 03:00 PM GMT',
      type: 'Hands-on Bootcamp',
      speaker: 'Amina Yusuf'
    }
  ];

  const articles = [
    {
      tag: 'Learning Tips',
      title: 'How to Stay Productive and Build Daily Coding Habits',
      date: 'May 10, 2026',
      readTime: '4 min read',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80'
    },
    {
      tag: 'Industry Trends',
      title: 'Top 10 High-Demand Tech Skills Companies Hire For',
      date: 'May 08, 2026',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=400&q=80'
    },
    {
      tag: 'Career Growth',
      title: 'How Verified Course Projects Accelerate Junior Hiring',
      date: 'May 05, 2026',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Upcoming Workshops & Events */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#082592] uppercase tracking-wider">
                  Live Masterclasses
                </span>
                <h3 className="text-2xl font-heading font-extrabold text-[#061A3A] tracking-tight mt-0.5">
                  Upcoming Events
                </h3>
              </div>
            </div>

            <div className="space-y-3.5">
              {events.map((evt, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-slate-200/80 hover:border-[#082592]/40 hover:bg-[#F2F6FF]/40 transition-all flex items-start gap-4"
                >
                  {/* Date Badge */}
                  <div className="w-14 h-14 rounded-xl bg-[#082592] text-white flex flex-col items-center justify-center shrink-0 shadow-xs">
                    <span className="text-lg font-heading font-extrabold leading-none">{evt.day}</span>
                    <span className="text-[10px] font-bold text-[#F28C18] mt-0.5">{evt.month}</span>
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <h4 className="text-sm font-heading font-bold text-slate-900 hover:text-[#082592] transition-colors">
                      {evt.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {evt.time}
                      </span>
                      <span>·</span>
                      <span className="text-[#082592] font-semibold">{evt.type}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Speaker: {evt.speaker}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: From Our Blog */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#082592] uppercase tracking-wider">
                  Insights & Research
                </span>
                <h3 className="text-2xl font-heading font-extrabold text-[#061A3A] tracking-tight mt-0.5">
                  From Our Tech Blog
                </h3>
              </div>
              <span className="text-xs font-bold text-[#082592]">
                Weekly Articles
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {articles.map((art, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-slate-200/80 overflow-hidden bg-white hover:shadow-lg transition-all flex flex-col justify-between group"
                >
                  <div className="aspect-16/10 overflow-hidden bg-slate-100">
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold text-[#F28C18] uppercase tracking-wider">
                        {art.tag}
                      </div>
                      <h4 className="text-xs font-heading font-bold text-slate-900 group-hover:text-[#082592] transition-colors mt-1 line-clamp-2">
                        {art.title}
                      </h4>
                    </div>
                    <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>{art.date}</span>
                      <span>{art.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
