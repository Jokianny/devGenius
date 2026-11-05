import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/common/AuthModal';
import { CpanelDeployModal } from './components/common/CpanelDeployModal';
import { SearchModal } from './components/common/SearchModal';
import { HeroSection } from './components/landing/HeroSection';
import { FeaturedCourses } from './components/landing/FeaturedCourses';
import { CourseCategories } from './components/landing/CourseCategories';
import { WhyChooseUs } from './components/landing/WhyChooseUs';
import { StatsSection } from './components/landing/StatsSection';
import { HowItWorks } from './components/landing/HowItWorks';
import { InstructorsSection } from './components/landing/InstructorsSection';
import { WorkshopsAndBlog } from './components/landing/WorkshopsAndBlog';
import { TestimonialsSection } from './components/landing/TestimonialsSection';
import { FaqSection } from './components/landing/FaqSection';
import { NewsletterSection } from './components/landing/NewsletterSection';
import { CourseDetailsModal } from './components/course/CourseDetailsModal';
import { StudentPortal } from './components/student/StudentPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { db } from './services/db';
import { User, Course, PlatformStats } from './types';
import { BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'courses' | 'student-portal' | 'admin-portal' | 'cpanel-hub'>('landing');
  const [currentUser, setCurrentUser] = useState<User | null>(db.getCurrentUser());
  const [stats, setStats] = useState<PlatformStats>(db.getPlatformStats());
  const [courses, setCourses] = useState<Course[]>(db.getCourses());
  const [instructors, setInstructors] = useState(db.getInstructors());

  // Modal controls
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('login');
  const [cpanelModalOpen, setCpanelModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Synchronize state with reactive database events
  useEffect(() => {
    const handleDbUpdate = () => {
      setCurrentUser(db.getCurrentUser());
      setStats(db.getPlatformStats());
      setCourses(db.getCourses());
      setInstructors(db.getInstructors());
    };

    window.addEventListener('devgenius_db_update', handleDbUpdate);
    return () => window.removeEventListener('devgenius_db_update', handleDbUpdate);
  }, []);

  const handleOpenAuth = (tab: 'login' | 'register' = 'login') => {
    setAuthInitialTab(tab);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    showToast(`Welcome, ${user.full_name}! Signed in successfully.`);
    if (user.role === 'admin') {
      setCurrentView('admin-portal');
    } else {
      setCurrentView('student-portal');
    }
  };

  const handleLogout = () => {
    db.logout();
    setCurrentUser(null);
    setCurrentView('landing');
    showToast('You have been logged out.');
  };

  const handleEnrolCourse = (courseId: string) => {
    if (!currentUser) {
      handleOpenAuth('register');
      return;
    }

    if (currentUser.role === 'admin') {
      showToast('Administrators manage courses in the Admin Portal.');
      return;
    }

    const res = db.enrolCourse(currentUser.id, courseId);
    showToast(res.message);
    if (res.success) {
      setCurrentView('student-portal');
    }
  };

  // Enrolled course IDs for current user
  const enrolledCourseIds = currentUser
    ? db.getUserEnrolments(currentUser.id).map(e => e.course_id)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#082592]/20 selection:text-[#061A3A]">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#061A3A] text-white px-4 py-3 rounded-xl shadow-2xl border border-blue-400/30 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#F28C18]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      {currentView !== 'student-portal' && currentView !== 'admin-portal' && (
        <Navbar
          currentUser={currentUser}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          onNavigate={(view) => {
            if (view === 'cpanel-hub') {
              setCpanelModalOpen(true);
            } else {
              setCurrentView(view);
            }
          }}
          currentView={currentView}
          onOpenSearch={() => setSearchModalOpen(true)}
          onOpenCpanelModal={() => setCpanelModalOpen(true)}
        />
      )}

      {/* Main View Router */}
      <div className="flex-1">
        {/* VIEW 1: LANDING PAGE */}
        {currentView === 'landing' && (
          <main>
            {/* Hero Section */}
            <HeroSection
              onExploreCourses={() => {
                const el = document.getElementById('featured-courses');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setCurrentView('courses');
              }}
              onGetStarted={() => {
                if (currentUser) {
                  setCurrentView(currentUser.role === 'admin' ? 'admin-portal' : 'student-portal');
                } else {
                  handleOpenAuth('register');
                }
              }}
            />

            {/* Featured Courses */}
            <FeaturedCourses
              courses={courses}
              currentUser={currentUser}
              enrolledCourseIds={enrolledCourseIds}
              onSelectCourse={(c) => setSelectedCourse(c)}
              onEnrolCourse={handleEnrolCourse}
              onViewAllCourses={() => setCurrentView('courses')}
            />

            {/* Course Categories */}
            <CourseCategories
              onSelectCategory={(_cat) => setCurrentView('courses')}
            />

            {/* Why Choose Us */}
            <WhyChooseUs />

            {/* Dynamic Real Platform Stats */}
            <StatsSection stats={stats} />

            {/* How It Works */}
            <HowItWorks
              onGetStarted={() => {
                if (currentUser) {
                  setCurrentView(currentUser.role === 'admin' ? 'admin-portal' : 'student-portal');
                } else {
                  handleOpenAuth('register');
                }
              }}
            />

            {/* Meet Our Instructors */}
            <InstructorsSection instructors={instructors} />

            {/* Upcoming Workshops & From Our Blog */}
            <WorkshopsAndBlog />

            {/* Student Testimonials */}
            <TestimonialsSection />

            {/* Interactive FAQ Accordion */}
            <FaqSection />

            {/* Newsletter Subscription */}
            <NewsletterSection />
          </main>
        )}

        {/* VIEW 2: COURSES CATALOG */}
        {currentView === 'courses' && (
          <main className="py-12 bg-slate-50 min-h-[75vh]">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-[#082592] uppercase tracking-wider">
                    Course Catalog
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#061A3A] tracking-tight mt-1">
                    Explore All DevGenius Courses
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                    Structured hands-on tracks in Web Development, Python Programming, UI/UX Design, and Data Systems.
                  </p>
                </div>

                <button
                  onClick={() => setCurrentView('landing')}
                  className="text-xs font-semibold text-[#082592] hover:underline self-start md:self-auto"
                >
                  ← Back to Home
                </button>
              </div>

              {/* Course Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => {
                  const isEnrolled = enrolledCourseIds.includes(course.id);

                  return (
                    <div
                      key={course.id}
                      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
                    >
                      <div 
                        className="relative aspect-16/9 overflow-hidden bg-slate-100 cursor-pointer"
                        onClick={() => setSelectedCourse(course)}
                      >
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 bg-[#082592] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                          {course.category}
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{course.duration}</span>
                            <span className="font-semibold text-slate-700">{course.level}</span>
                          </div>

                          <h3 
                            onClick={() => setSelectedCourse(course)}
                            className="font-heading font-bold text-base text-slate-900 hover:text-[#082592] transition-colors mt-2 cursor-pointer line-clamp-2"
                          >
                            {course.title}
                          </h3>

                          <p className="text-xs text-slate-600 line-clamp-3 mt-1.5 leading-relaxed">
                            {course.description}
                          </p>

                          <div className="pt-2 text-xs text-slate-500">
                            Instructor: <span className="font-medium text-slate-800">{course.instructor_name}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <div className="text-[11px] text-slate-400">Tuition</div>
                            <div className="text-xl font-heading font-extrabold text-[#082592]">
                              ${course.price}.00
                            </div>
                          </div>

                          {isEnrolled ? (
                            <span className="py-2 px-3 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Enrolled
                            </span>
                          ) : (
                            <button
                              onClick={() => handleEnrolCourse(course.id)}
                              className="py-2 px-4 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              Enrol Now
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        )}

        {/* VIEW 3: STUDENT PORTAL */}
        {currentView === 'student-portal' && currentUser && (
          <StudentPortal
            currentUser={currentUser}
            onLogout={handleLogout}
            onNavigateHome={() => setCurrentView('landing')}
            onOpenCourseDetails={(course) => setSelectedCourse(course)}
          />
        )}

        {/* VIEW 4: ADMINISTRATOR PORTAL */}
        {currentView === 'admin-portal' && currentUser?.role === 'admin' && (
          <AdminPortal
            currentUser={currentUser}
            onLogout={handleLogout}
            onNavigateHome={() => setCurrentView('landing')}
            onOpenCpanelModal={() => setCpanelModalOpen(true)}
          />
        )}
      </div>

      {/* Global Footer (Visible on landing and courses views) */}
      {currentView !== 'student-portal' && currentView !== 'admin-portal' && (
        <Footer
          onNavigate={(view) => {
            if (view === 'cpanel-hub') {
              setCpanelModalOpen(true);
            } else {
              setCurrentView(view);
            }
          }}
          onOpenCpanelModal={() => setCpanelModalOpen(true)}
          onOpenAuth={handleOpenAuth}
        />
      )}

      {/* Auth Modal (Login & Register) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authInitialTab}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Course Details Modal */}
      <CourseDetailsModal
        course={selectedCourse}
        isOpen={!!selectedCourse}
        onClose={() => setSelectedCourse(null)}
        currentUser={currentUser}
        isEnrolled={selectedCourse ? enrolledCourseIds.includes(selectedCourse.id) : false}
        onEnrol={handleEnrolCourse}
        onGoToDashboard={() => setCurrentView('student-portal')}
      />

      {/* cPanel Shared Hosting & SQL Hub */}
      <CpanelDeployModal
        isOpen={cpanelModalOpen}
        onClose={() => setCpanelModalOpen(false)}
      />

      {/* Fast Course Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        courses={courses}
        onSelectCourse={(course) => setSelectedCourse(course)}
      />
    </div>
  );
}
