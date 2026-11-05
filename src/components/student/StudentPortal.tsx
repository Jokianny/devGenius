import React, { useState } from 'react';
import { 
  LayoutDashboard, BookOpen, Layers, FileCheck, 
  Award, User as UserIcon, LogOut, ArrowRight, 
  Upload, CheckCircle2, Clock, AlertCircle, ChevronRight, 
  FileText, Search, Star, Sparkles, Filter 
} from 'lucide-react';
import { User, Course, CourseEnrolment, Assignment, AssignmentSubmission } from '../../types';
import { db } from '../../services/db';

interface StudentPortalProps {
  currentUser: User;
  onLogout: () => void;
  onNavigateHome: () => void;
  onOpenCourseDetails: (course: Course) => void;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  currentUser,
  onLogout,
  onNavigateHome,
  onOpenCourseDetails
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'browse' | 'my-courses' | 'assignments' | 'results' | 'profile'>('overview');
  
  // Data subscriptions
  const courses = db.getCourses();
  const enrolments = db.getUserEnrolments(currentUser.id);
  const assignments = db.getAssignments();
  const submissions = db.getUserSubmissions(currentUser.id);

  // Assignment submission modal state
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [submitFileName, setSubmitFileName] = useState('');
  const [submitFileSize, setSubmitFileSize] = useState('');
  const [submitComments, setSubmitComments] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile update state
  const [profileName, setProfileName] = useState(currentUser.full_name);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone);
  const [profileBio, setProfileBio] = useState(currentUser.bio || '');
  const [profileMessage, setProfileMessage] = useState('');

  // Course search in Browse
  const [searchQuery, setSearchQuery] = useState('');
  const [browseCategory, setBrowseCategory] = useState('All');

  // Computed live metrics
  const enrolledCourseIds = enrolments.map(e => e.course_id);
  
  // Relevant assignments: assignments for courses the student is enrolled in
  const relevantAssignments = assignments.filter(a => enrolledCourseIds.includes(a.course_id));
  
  const pendingAssignments = relevantAssignments.filter(
    a => !submissions.some(s => s.assignment_id === a.id)
  );

  const gradedSubmissions = submissions.filter(s => s.status === 'Graded');
  const totalScore = gradedSubmissions.reduce((acc, s) => acc + (s.score || 0), 0);
  const averageScore = gradedSubmissions.length > 0 ? Math.round(totalScore / gradedSubmissions.length) : null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSubmitFileName(file.name);
      const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
      setSubmitFileSize(`${sizeInMb} MB`);
    }
  };

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssignment) return;

    if (!submitFileName) {
      setSubmitMessage('Please choose a file to submit (PDF, DOCX, ZIP, or code file).');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const res = db.submitAssignment({
        assignment_id: selectedAssignment.id,
        course_id: selectedAssignment.course_id,
        user_id: currentUser.id,
        file_name: submitFileName,
        file_size: submitFileSize || '1.8 MB',
        comments: submitComments
      });

      setIsSubmitting(false);

      if (res.success) {
        setSubmitMessage(res.message);
        setTimeout(() => {
          setSelectedAssignment(null);
          setSubmitFileName('');
          setSubmitFileSize('');
          setSubmitComments('');
          setSubmitMessage('');
        }, 1200);
      }
    }, 400);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    db.updateUserProfile(currentUser.id, {
      full_name: profileName,
      phone: profilePhone,
      bio: profileBio
    });
    setProfileMessage('Profile updated successfully!');
    setTimeout(() => setProfileMessage(''), 2500);
  };

  const handleQuickEnrol = (courseId: string) => {
    const res = db.enrolCourse(currentUser.id, courseId);
    if (!res.success) {
      alert(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#061A3A] text-slate-300 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <button 
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#082592] flex items-center justify-center text-white font-bold text-sm">
                DG
              </div>
              <div>
                <span className="font-heading font-extrabold text-sm text-white tracking-tight">
                  DEVGENIUS
                </span>
                <span className="text-[10px] block text-[#F28C18] font-semibold">STUDENT PORTAL</span>
              </div>
            </button>
          </div>

          {/* Student Profile Quick Badge */}
          <div className="p-4 mx-4 my-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <img
              src={currentUser.avatar || '/src/assets/images/hero_student_1793881077112.jpg'}
              alt={currentUser.full_name}
              className="w-10 h-10 rounded-full object-cover border border-white/20"
            />
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">{currentUser.full_name}</div>
              <div className="text-[10px] text-slate-400 truncate">{currentUser.email}</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#082592] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-[#F28C18]" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('browse')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'browse'
                  ? 'bg-[#082592] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#F28C18]" />
              <span>Browse Courses</span>
            </button>

            <button
              onClick={() => setActiveTab('my-courses')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'my-courses'
                  ? 'bg-[#082592] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-[#F28C18]" />
                <span>My Courses</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 font-bold">
                {enrolments.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('assignments')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'assignments'
                  ? 'bg-[#082592] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileCheck className="w-4 h-4 text-[#F28C18]" />
                <span>Assignments</span>
              </div>
              {pendingAssignments.length > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F28C18] text-white font-bold">
                  {pendingAssignments.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'results'
                  ? 'bg-[#082592] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Award className="w-4 h-4 text-[#F28C18]" />
              <span>My Results</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#082592] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserIcon className="w-4 h-4 text-[#F28C18]" />
              <span>My Profile</span>
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={onNavigateHome}
            className="w-full py-2 px-3 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Public Website
          </button>
          <button
            onClick={onLogout}
            className="w-full py-2 px-3 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 max-w-6xl overflow-y-auto">
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#082592] to-[#1746C5] rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-lg z-10">
                <span className="text-xs font-bold text-[#F28C18] uppercase tracking-wider">
                  Academic Progress
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                  Welcome back, {currentUser.full_name}!
                </h2>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                  You are making great progress. Check your upcoming course deadlines and submit assignments to earn your verified certificates.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('browse')}
                className="z-10 py-2.5 px-5 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5"
              >
                Browse New Courses
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Live Stats Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="text-xs font-semibold text-slate-500">Enrolled Courses</div>
                <div className="text-2xl font-heading font-extrabold text-[#082592] mt-1 tabular-nums">
                  {enrolments.length}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Active curriculum tracks</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="text-xs font-semibold text-slate-500">Pending Assignments</div>
                <div className="text-2xl font-heading font-extrabold text-[#F28C18] mt-1 tabular-nums">
                  {pendingAssignments.length}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Awaiting your solution</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="text-xs font-semibold text-slate-500">Submitted</div>
                <div className="text-2xl font-heading font-extrabold text-blue-600 mt-1 tabular-nums">
                  {submissions.length}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Total submissions made</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="text-xs font-semibold text-slate-500">Graded Work</div>
                <div className="text-2xl font-heading font-extrabold text-emerald-600 mt-1 tabular-nums">
                  {gradedSubmissions.length}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">With faculty feedback</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs col-span-2 lg:col-span-1">
                <div className="text-xs font-semibold text-slate-500">Average Grade</div>
                <div className="text-2xl font-heading font-extrabold text-slate-900 mt-1 tabular-nums">
                  {averageScore !== null ? `${averageScore}%` : 'N/A'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Overall GPA indicator</div>
              </div>
            </div>

            {/* Enrolled Courses Summary */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    My Enrolled Courses
                  </h3>
                  <p className="text-xs text-slate-500">Current syllabus and completion status</p>
                </div>
                <button
                  onClick={() => setActiveTab('my-courses')}
                  className="text-xs font-bold text-[#082592] hover:underline"
                >
                  View All ({enrolments.length})
                </button>
              </div>

              {enrolments.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-xl space-y-3">
                  <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-600 font-medium">
                    You have not enrolled in any courses yet.
                  </p>
                  <button
                    onClick={() => setActiveTab('browse')}
                    className="py-2 px-4 bg-[#082592] text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Browse Available Courses
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {enrolments.slice(0, 4).map((enr) => {
                    const course = courses.find(c => c.id === enr.course_id);
                    if (!course) return null;

                    return (
                      <div key={enr.id} className="p-4 rounded-xl border border-slate-200 hover:border-blue-200 transition-all space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-[#082592] bg-blue-50 px-2 py-0.5 rounded">
                              {course.category}
                            </span>
                            <h4 className="font-heading font-bold text-sm text-slate-900 mt-1 line-clamp-1">
                              {course.title}
                            </h4>
                          </div>
                          <button
                            onClick={() => onOpenCourseDetails(course)}
                            className="p-1 text-slate-400 hover:text-[#082592]"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                            <span>Course Progress</span>
                            <span className="font-bold text-slate-800">{enr.progress_percent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-[#082592] h-full rounded-full transition-all duration-500"
                              style={{ width: `${enr.progress_percent}%` }}
                            />
                          </div>
                        </div>

                        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                          <span>Instructor: {course.instructor_name}</span>
                          <button
                            onClick={() => {
                              db.updateProgress(enr.id, Math.min(100, enr.progress_percent + 15));
                            }}
                            className="text-[10px] font-semibold text-[#082592] hover:underline"
                          >
                            + Mark Lesson Done
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Upcoming Pending Assignments */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    Pending Tasks & Submissions
                  </h3>
                  <p className="text-xs text-slate-500">Assignments that need your solution</p>
                </div>
                <button
                  onClick={() => setActiveTab('assignments')}
                  className="text-xs font-bold text-[#082592] hover:underline"
                >
                  Manage Assignments
                </button>
              </div>

              {pendingAssignments.length === 0 ? (
                <div className="p-6 bg-emerald-50 rounded-xl text-center text-xs text-emerald-800 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>You are all caught up! No pending assignments at this time.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingAssignments.map((asg) => (
                    <div key={asg.id} className="p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-semibold text-slate-500">{asg.course_title}</span>
                        <h4 className="font-heading font-bold text-sm text-slate-900">{asg.title}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1 text-rose-600 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            Due: {new Date(asg.due_date).toLocaleDateString()}
                          </span>
                          <span>·</span>
                          <span>Max: {asg.max_score} pts</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedAssignment(asg)}
                        className="py-2 px-4 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-center"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        Submit File
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. BROWSE COURSES TAB */}
        {activeTab === 'browse' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-2xl font-heading font-extrabold text-slate-900">
                Browse Available Courses
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Explore tech tracks, view curriculum syllabi, and enrol with a single click.
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by course title, category, or instructor..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-hidden focus:border-[#082592]"
                />
              </div>

              <select
                value={browseCategory}
                onChange={(e) => setBrowseCategory(e.target.value)}
                className="w-full sm:w-48 px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-hidden"
              >
                <option value="All">All Categories</option>
                <option value="Web Development">Web Development</option>
                <option value="Programming">Programming</option>
                <option value="Design">Design</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Database Management">Database Management</option>
              </select>
            </div>

            {/* Courses Catalog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses
                .filter(c => c.is_active)
                .filter(c => browseCategory === 'All' || c.category === browseCategory)
                .filter(c => 
                  c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  c.instructor_name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((course) => {
                  const isEnrolled = enrolledCourseIds.includes(course.id);

                  return (
                    <div
                      key={course.id}
                      className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                    >
                      <div className="relative aspect-16/9 overflow-hidden bg-slate-100">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-[#082592] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          {course.category}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <div className="text-[11px] text-slate-500 flex items-center justify-between">
                            <span>{course.duration}</span>
                            <span className="font-semibold text-slate-700">{course.level}</span>
                          </div>

                          <h3 
                            onClick={() => onOpenCourseDetails(course)}
                            className="font-heading font-bold text-sm text-slate-900 hover:text-[#082592] transition-colors mt-1.5 cursor-pointer line-clamp-1"
                          >
                            {course.title}
                          </h3>

                          <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                            {course.description}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400">Tuition</span>
                            <div className="text-base font-extrabold text-[#082592] leading-tight">
                              ${course.price}.00
                            </div>
                          </div>

                          {isEnrolled ? (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Enrolled
                            </span>
                          ) : (
                            <button
                              onClick={() => handleQuickEnrol(course.id)}
                              className="py-1.5 px-3.5 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer flex items-center gap-1"
                            >
                              Enrol
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* 3. MY COURSES TAB */}
        {activeTab === 'my-courses' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-heading font-extrabold text-slate-900">
                  My Enrolled Courses
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track your learning modules, access assignments, and mark lessons complete.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('browse')}
                className="py-2 px-3.5 bg-[#082592] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                + Enrol in Another Course
              </button>
            </div>

            {enrolments.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-heading font-bold text-base text-slate-900">No active enrolments yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Browse our featured curriculum tracks and enrol to begin your tech career training.
                </p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="py-2.5 px-5 bg-[#F28C18] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {enrolments.map((enr) => {
                  const course = courses.find(c => c.id === enr.course_id);
                  if (!course) return null;

                  return (
                    <div key={enr.id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-20 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-[#082592] bg-blue-50 px-2 py-0.5 rounded">
                            {course.category}
                          </span>
                          <h4 className="font-heading font-bold text-base text-slate-900">
                            {course.title}
                          </h4>
                          <p className="text-xs text-slate-500">
                            Instructor: {course.instructor_name} · Enrolled on {new Date(enr.enrolled_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="w-full md:w-64 space-y-2">
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span>Progress</span>
                          <span>{enr.progress_percent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-[#082592] h-full rounded-full transition-all duration-500"
                            style={{ width: `${enr.progress_percent}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-1">
                          <button
                            onClick={() => db.updateProgress(enr.id, Math.min(100, enr.progress_percent + 20))}
                            className="text-[#082592] font-semibold hover:underline"
                          >
                            + Mark Milestone
                          </button>
                          <button
                            onClick={() => onOpenCourseDetails(course)}
                            className="text-[#F28C18] font-semibold hover:underline"
                          >
                            Syllabus
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 4. ASSIGNMENTS TAB */}
        {activeTab === 'assignments' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-2xl font-heading font-extrabold text-slate-900">
                Course Assignments
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete assignments for your enrolled tracks and submit files securely for grading.
              </p>
            </div>

            {relevantAssignments.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
                <FileCheck className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-600">
                  You are not enrolled in any courses with active assignments yet.
                </p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="py-1.5 px-3 bg-[#082592] text-white text-xs font-bold rounded-lg"
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {relevantAssignments.map((asg) => {
                  const submission = submissions.find(s => s.assignment_id === asg.id);

                  return (
                    <div
                      key={asg.id}
                      className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-[#082592] bg-blue-50 px-2 py-0.5 rounded">
                            {asg.course_title}
                          </span>
                          <h3 className="font-heading font-bold text-base text-slate-900 mt-1">
                            {asg.title}
                          </h3>
                        </div>

                        {submission ? (
                          <div className="flex items-center gap-2">
                            {submission.status === 'Graded' ? (
                              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
                                Graded: {submission.score}/100 ({submission.grade})
                              </span>
                            ) : (
                              <span className="px-3 py-1 bg-blue-50 text-[#082592] text-xs font-bold rounded-lg border border-blue-200">
                                Submitted · Awaiting Review
                              </span>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedAssignment(asg)}
                            className="py-2 px-4 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            Submit Solution
                          </button>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {asg.description}
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-slate-700">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            Deadline: {new Date(asg.due_date).toLocaleDateString()}
                          </span>
                          <span>·</span>
                          <span>Max Marks: {asg.max_score}</span>
                        </div>

                        {submission && (
                          <div className="text-[11px] text-slate-500">
                            File: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-semibold">{submission.file_name}</code> ({submission.file_size})
                          </div>
                        )}
                      </div>

                      {/* If graded, show feedback banner right here */}
                      {submission?.status === 'Graded' && submission.feedback && (
                        <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-900 mt-2 space-y-1">
                          <div className="font-bold flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-emerald-700" />
                            Faculty Feedback:
                          </div>
                          <p className="italic">{submission.feedback}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 5. MY RESULTS TAB */}
        {activeTab === 'results' && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-2xl font-heading font-extrabold text-slate-900">
                My Academic Results
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review your scores, letter grades, and personalized faculty evaluations.
              </p>
            </div>

            {submissions.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
                <Award className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-heading font-bold text-base text-slate-900">No submissions recorded</h3>
                <p className="text-xs text-slate-500">
                  Submit course assignments to receive grades and verified certificates.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                      <tr>
                        <th className="py-3 px-4">Assignment / Course</th>
                        <th className="py-3 px-4">Submitted File</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Score</th>
                        <th className="py-3 px-4">Faculty Feedback</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {submissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50/70">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">{sub.assignment_title}</div>
                            <div className="text-[10px] text-slate-400">{sub.course_title}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">
                            {sub.file_name}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500">
                            {new Date(sub.submitted_at).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-4">
                            {sub.status === 'Graded' ? (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                                Graded
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">
                                Submitted
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {sub.score !== undefined ? (
                              <span className="font-heading font-extrabold text-sm text-[#082592] tabular-nums">
                                {sub.score}/100 ({sub.grade})
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">Pending</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 max-w-xs">
                            {sub.feedback ? (
                              <p className="line-clamp-2 italic">{sub.feedback}</p>
                            ) : (
                              <span className="text-slate-400 italic">No feedback yet</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 animate-in fade-in">
            <div>
              <h2 className="text-2xl font-heading font-extrabold text-slate-900">
                Student Profile Settings
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your contact information and public bio for DevGenius Academy.
              </p>
            </div>

            {profileMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{profileMessage}</span>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#082592]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address (Read-only)</label>
                <input
                  type="email"
                  value={currentUser.email}
                  disabled
                  className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded-lg text-slate-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#082592]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bio / Career Goal</label>
                <textarea
                  rows={3}
                  value={profileBio}
                  onChange={(e) => setProfileBio(e.target.value)}
                  placeholder="Tell your mentors about your tech interests..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#082592]"
                />
              </div>

              <button
                type="submit"
                className="py-2.5 px-6 bg-[#082592] hover:bg-[#061A3A] text-white font-bold rounded-lg transition-colors cursor-pointer"
              >
                Save Profile Changes
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Assignment Submission Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#061A3A]/75 backdrop-blur-xs animate-in fade-in">
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-100 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-[#082592] uppercase">{selectedAssignment.course_title}</span>
                <h3 className="font-heading font-bold text-base text-slate-900 mt-0.5">
                  Submit Assignment
                </h3>
              </div>
              <button 
                onClick={() => setSelectedAssignment(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl text-xs text-blue-900">
              <div className="font-bold">{selectedAssignment.title}</div>
              <p className="mt-1 text-slate-600 leading-relaxed text-[11px]">{selectedAssignment.description}</p>
            </div>

            {submitMessage && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{submitMessage}</span>
              </div>
            )}

            <form onSubmit={handleAssignmentSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Upload File (PDF, DOCX, ZIP, or Code)
                </label>
                <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50/70 hover:bg-white transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    accept=".pdf,.doc,.docx,.zip,.py,.js,.html,.css,.sql"
                  />
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <p className="font-medium text-slate-700">
                    {submitFileName ? submitFileName : 'Click or drag your assignment file here'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {submitFileSize ? `Size: ${submitFileSize}` : 'Supported formats: ZIP, PDF, DOCX, Code (Max 25MB)'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Submission Comments & GitHub Link
                </label>
                <textarea
                  rows={3}
                  value={submitComments}
                  onChange={(e) => setSubmitComments(e.target.value)}
                  placeholder="Include any project notes, test instructions, or repo URL for your instructor..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#082592]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedAssignment(null)}
                  className="py-2 px-4 text-slate-600 hover:text-slate-800 cursor-pointer font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-2.5 px-5 bg-[#F28C18] hover:bg-[#d9770e] text-white font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isSubmitting ? 'Uploading...' : 'Submit to Faculty'}
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
