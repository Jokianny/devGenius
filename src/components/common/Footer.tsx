import React from 'react';
import { 
  GraduationCap, Mail, Phone, MapPin, 
  ArrowRight, ShieldCheck, Server, Globe 
} from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'landing' | 'courses' | 'student-portal' | 'admin-portal' | 'cpanel-hub') => void;
  onOpenCpanelModal: () => void;
  onOpenAuth: (tab: 'login' | 'register') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenCpanelModal,
  onOpenAuth
}) => {
  return (
    <footer className="bg-[#061A3A] text-slate-300 pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#082592] to-[#1746C5] flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-xl tracking-tight text-white">
                  DEVGENIUS
                </span>
                <span className="ml-1.5 font-heading font-bold text-xs px-1.5 py-0.5 rounded bg-[#F28C18]/20 text-[#F28C18]">
                  ACADEMY
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              DevGenius Academy is a premier modern technology institution delivering practical, industry-aligned training in Web Development, Python Programming, UI/UX Design, and Data Systems.
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Verified Curriculum
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#F28C18]" />
                Pan-African & Global Access
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-heading">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button 
                  onClick={() => onNavigate('landing')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('courses')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  All Courses
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('student-portal')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Student Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('admin-portal')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Admin Portal
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenAuth('register')}
                  className="text-[#F28C18] hover:underline transition-colors cursor-pointer text-left font-medium"
                >
                  Student Registration
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Courses */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-heading">
              Popular Tracks
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button 
                  onClick={() => onNavigate('courses')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Web Development Bootcamp
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('courses')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Python & AI Programming
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('courses')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  UI/UX Design Systems
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('courses')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Database Management & SQL
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('courses')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Digital Marketing & Growth
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Hosting */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-heading">
              Support & Hosting
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F28C18] shrink-0" />
                <span className="truncate">contact@devgenius.academy</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F28C18] shrink-0" />
                <span>+1 (800) 456-7890</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F28C18] shrink-0 mt-0.5" />
                <span>Innovation Park, Tech Avenue</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={onOpenCpanelModal}
                className="w-full py-2 px-3 bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-200 rounded-lg border border-white/10 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-emerald-400" />
                  cPanel & DirectAdmin Hub
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DevGenius Academy. All rights reserved. Designed for excellence.</p>
          <div className="flex items-center gap-5">
            <button 
              onClick={onOpenCpanelModal}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              cPanel & DirectAdmin Guide
            </button>
            <span>·</span>
            <button 
              onClick={() => onOpenAuth('login')}
              className="hover:text-slate-300 transition-colors cursor-pointer"
            >
              Portal Login
            </button>
            <span>·</span>
            <span>PHP 8.1+ & MySQL Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
