import React, { useState } from 'react';
import { 
  GraduationCap, Phone, Mail, Search, Menu, X, 
  User as UserIcon, LogOut, LayoutDashboard, Shield, 
  BookOpen, Server, ChevronDown, CheckCircle2 
} from 'lucide-react';
import { User } from '../../types';

interface NavbarProps {
  currentUser: User | null;
  onOpenAuth: (initialTab?: 'login' | 'register') => void;
  onLogout: () => void;
  onNavigate: (view: 'landing' | 'courses' | 'student-portal' | 'admin-portal' | 'cpanel-hub') => void;
  currentView: string;
  onOpenSearch: () => void;
  onOpenCpanelModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  onNavigate,
  currentView,
  onOpenSearch,
  onOpenCpanelModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs">
      {/* 1. Slim Top Information Bar (Deep Navy #061A3A) */}
      <div className="bg-[#061A3A] text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-6">
            <a 
              href="mailto:contact@devgenius.academy" 
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#F28C18]" />
              <span>contact@devgenius.academy</span>
            </a>
            <a 
              href="tel:+18004567890" 
              className="hidden sm:flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#F28C18]" />
              <span>+1 (800) 456-7890</span>
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenCpanelModal}
              className="flex items-center gap-1.5 text-slate-300 hover:text-[#F28C18] transition-colors cursor-pointer"
              title="View cPanel & DirectAdmin Shared Hosting & MySQL Configuration"
            >
              <Server className="w-3.5 h-3.5 text-[#F28C18]" />
              <span className="font-medium">cPanel / DirectAdmin Hub</span>
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Admissions Open 2026</span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-6">
        {/* Brand Logo Lockup */}
        <button 
          onClick={() => { onNavigate('landing'); setMobileMenuOpen(false); }}
          className="flex items-center gap-3 text-left group cursor-pointer focus-visible:outline-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#082592] to-[#1746C5] flex items-center justify-center text-white shadow-md shadow-blue-900/10 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-[#061A3A]">
                DEVGENIUS
              </span>
              <span className="font-heading font-bold text-xs px-1.5 py-0.5 rounded bg-[#F28C18]/15 text-[#F28C18]">
                ACADEMY
              </span>
            </div>
            <p className="text-[10px] text-slate-500 tracking-wider uppercase font-medium">Professional E-Learning</p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700">
          <button
            onClick={() => onNavigate('landing')}
            className={`transition-colors cursor-pointer ${currentView === 'landing' ? 'text-[#082592] font-semibold' : 'hover:text-[#082592]'}`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate('courses')}
            className={`transition-colors cursor-pointer ${currentView === 'courses' ? 'text-[#082592] font-semibold' : 'hover:text-[#082592]'}`}
          >
            Courses
          </button>
          <a
            href="#why-choose-us"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('why-choose-us')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-[#082592] transition-colors"
          >
            About Us
          </a>
          <a
            href="#instructors"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('instructors')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-[#082592] transition-colors"
          >
            Our Instructors
          </a>
          <a
            href="#faq"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-[#082592] transition-colors"
          >
            FAQ
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              if (currentView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="hover:text-[#082592] transition-colors"
          >
            Contact
          </a>
        </div>

        {/* Right Action Zone */}
        <div className="flex items-center gap-3">
          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-lg text-slate-600 hover:text-[#082592] hover:bg-slate-100 transition-colors cursor-pointer"
            title="Search Courses"
            aria-label="Search Courses"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* User Logged In / Guest Actions */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pl-2.5 rounded-full border border-slate-200 hover:border-blue-400 bg-white transition-all cursor-pointer"
              >
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-900 leading-tight">
                    {currentUser.full_name}
                  </div>
                  <div className="text-[10px] text-[#082592] font-medium capitalize flex items-center gap-1">
                    {currentUser.role === 'admin' ? (
                      <span className="text-amber-600 font-bold flex items-center gap-0.5">
                        <Shield className="w-2.5 h-2.5" /> Admin
                      </span>
                    ) : (
                      <span className="text-blue-700 flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" /> Student
                      </span>
                    )}
                  </div>
                </div>
                <img
                  src={currentUser.avatar || '/src/assets/images/hero_student_1793881077112.jpg'}
                  alt={currentUser.full_name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-500 mr-1" />
              </button>

              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-500">Signed in as</p>
                    <p className="text-xs font-semibold text-slate-800 truncate">{currentUser.email}</p>
                  </div>

                  {currentUser.role === 'admin' ? (
                    <button
                      onClick={() => {
                        onNavigate('admin-portal');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-[#F2F6FF] hover:text-[#082592] flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <Shield className="w-4 h-4 text-[#F28C18]" />
                      Administrator Portal
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        onNavigate('student-portal');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-[#F2F6FF] hover:text-[#082592] flex items-center gap-2 font-medium cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#082592]" />
                      Student Dashboard
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onOpenCpanelModal();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-[#F2F6FF] hover:text-[#082592] flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <Server className="w-4 h-4 text-emerald-600" />
                    cPanel & DirectAdmin Hosting Hub
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-2 text-xs font-semibold text-[#082592] hover:bg-[#F2F6FF] rounded-lg transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-4 py-2 text-xs font-bold text-white bg-[#F28C18] hover:bg-[#d9770e] rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer whitespace-nowrap"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-6 py-4 shadow-lg space-y-3">
          <button
            onClick={() => { onNavigate('landing'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-sm font-semibold text-slate-800 hover:text-[#082592]"
          >
            Home
          </button>
          <button
            onClick={() => { onNavigate('courses'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-sm font-semibold text-slate-800 hover:text-[#082592]"
          >
            Courses
          </button>
          <a
            href="#why-choose-us"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-800 hover:text-[#082592]"
          >
            Why Choose Us
          </a>
          <a
            href="#instructors"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-800 hover:text-[#082592]"
          >
            Meet Instructors
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-800 hover:text-[#082592]"
          >
            FAQ
          </a>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => { onOpenCpanelModal(); setMobileMenuOpen(false); }}
              className="w-full py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg flex items-center justify-center gap-2"
            >
              <Server className="w-4 h-4 text-[#082592]" />
              cPanel / DirectAdmin Hosting Hub & SQL
            </button>

            {currentUser ? (
              <>
                <button
                  onClick={() => {
                    onNavigate(currentUser.role === 'admin' ? 'admin-portal' : 'student-portal');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#082592] rounded-lg flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  {currentUser.role === 'admin' ? 'Admin Portal' : 'Student Dashboard'}
                </button>
                <button
                  onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                  className="w-full py-2 px-4 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => { onOpenAuth('login'); setMobileMenuOpen(false); }}
                  className="py-2.5 text-xs font-semibold text-[#082592] border border-[#082592] rounded-lg text-center"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { onOpenAuth('register'); setMobileMenuOpen(false); }}
                  className="py-2.5 text-xs font-bold text-white bg-[#F28C18] rounded-lg text-center"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
