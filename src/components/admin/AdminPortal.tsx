import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, BookOpen, FileCheck, 
  Award, Shield, LogOut, ArrowRight, Plus, 
  Search, CheckCircle2, Clock, Edit2, ToggleLeft, 
  ToggleRight, Download, Server, Sparkles, Filter 
} from 'lucide-react';
import { User, Course, Assignment, AssignmentSubmission, Instructor } from '../../types';
import { db } from '../../services/db';

interface AdminPortalProps {
  currentUser: User;
  onLogout: () => void;
  onNavigateHome: () => void;
  onOpenCpanelModal: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUser,
  onLogout,
  onNavigateHome,
  onOpenCpanelModal
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'courses' | 'grading' | 'instructors'>('overview');
  
  // Real database subscriptions
  const stats = db.getPlatformStats();
  const allUsers = db.getUsers();
  // Filter ONLY students (strict requirement in section 6.E)
  const students = allUsers.filter(u => u.role === 'student');
  const courses = db.getCourses();
  const enrolments = db.getEnrolments();
  const assignments = db.getAssignments();
  const submissions = db.getSubmissions();
  const instructors = db.getInstructors();

  // Search & Filter states
  const [studentSearch, setStudentSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [gradingStatusFilter, setGradingStatusFilter] = useState<'All' | 'Submitted' | 'Graded'>('All');

  // Add Course Modal State
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Web Development');
  const [newInstructorName, setNewInstructorName] = useState(instructors[0]?.name || 'Dr. David Adeleke');
  const [newDuration, setNewDuration] = useState('10 Weeks');
  const [newLevel, setNewLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [newPrice, setNewPrice] = useState(49);
  const [newDescription, setNewDescription] = useState('');
  const [newThumbnail, setNewThumbnail] = useState('/src/assets/images/course_web_dev_1793881077580.jpg');

  // Student Profile Detail Drawer/Modal
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  // Grade Modal State
  const [gradingSubmission, setGradingSubmission] = useState<AssignmentSubmission | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(90);
  const [gradeFeedback, setGradeFeedback] = useState<string>('');
  const [gradeSuccessMessage, setGradeSuccessMessage] = useState<string>('');

  // Add Assignment Modal State
  const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
  const [asgCourseId, setAsgCourseId] = useState(courses[0]?.id || '');
  const [asgTitle, setAsgTitle] = useState('');
  const [asgDescription, setAsgDescription] = useState('');
  const [asgDueDate, setAsgDueDate] = useState('2026-04-15');
  const [asgMaxScore, setAsgMaxScore] = useState(100);

  const handleAddCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    db.addCourse({
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: newCategory,
      description: newDescription,
      instructor_id: instructors[0]?.id || 'inst-1',
      instructor_name: newInstructorName,
      duration: newDuration,
      level: newLevel,
      price: Number(newPrice),
      thumbnail: newThumbnail,
      is_active: true,
      syllabus: [
        {
          week: 1,
          title: 'Foundation & Principles',
          topics: ['Core concepts overview', 'Tooling and environment setup', 'First project milestone']
        },
        {
          week: 2,
          title: 'Advanced Implementation',
          topics: ['Industry best practices', 'Testing and optimization', 'Final project delivery']
        }
      ]
    });

    setShowAddCourseModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  const handleAddAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgTitle.trim() || !asgDescription.trim()) return;

    const course = db.getCourseById(asgCourseId);
    if (!course) return;

    db.addAssignment({
      course_id: asgCourseId,
      course_title: course.title,
      title: asgTitle,
      description: asgDescription,
      due_date: new Date(asgDueDate).toISOString(),
      max_score: Number(asgMaxScore)
    });

    setShowAddAssignmentModal(false);
    setAsgTitle('');
    setAsgDescription('');
  };

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    const res = db.gradeSubmission(gradingSubmission.id, Number(gradeScore), gradeFeedback);
    setGradeSuccessMessage(res.message);

    setTimeout(() => {
      setGradingSubmission(null);
      setGradeFeedback('');
      setGradeSuccessMessage('');
    }, 1000);
  };

  const toggleCourseStatus = (courseId: string) => {
    db.toggleCourseStatus(courseId);
  };

  const filteredSubmissions = submissions
    .filter(s => courseFilter === 'All' || s.course_id === courseFilter)
    .filter(s => gradingStatusFilter === 'All' || s.status === gradingStatusFilter);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#061A3A] text-slate-300 flex flex-col justify-between shrink-0">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <button 
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-[#F28C18] flex items-center justify-center text-white font-bold text-sm">
                DG
              </div>
              <div>
                <span className="font-heading font-extrabold text-sm text-white tracking-tight">
                  DEVGENIUS
                </span>
                <span className="text-[10px] block text-[#F28C18] font-bold">ADMIN CONSOLE</span>
              </div>
            </button>
          </div>

          {/* Admin Profile Chip */}
          <div className="p-4 mx-4 my-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 text-[#F28C18] flex items-center justify-center font-bold">
              <Shield className="w-5 h-5 text-[#F28C18]" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-bold text-white truncate">{currentUser.full_name}</div>
              <div className="text-[10px] text-amber-400 font-semibold uppercase">Super Administrator</div>
            </div>
          </div>

          {/* Nav */}
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
              <span>Admin Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('students')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'students'
                  ? 'bg-[#082592] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-[#F28C18]" />
                <span>Manage Students</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 font-bold tabular-nums">
                {stats.totalStudents}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'courses'
                  ? 'bg-[#082592] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-4 h-4 text-[#F28C18]" />
                <span>Manage Courses</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 font-bold tabular-nums">
                {courses.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('grading')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'grading'
                  ? 'bg-[#082592] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileCheck className="w-4 h-4 text-[#F28C18]" />
                <span>Grade Submissions</span>
              </div>
              {stats.pendingGrading > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#F28C18] text-white font-bold tabular-nums">
                  {stats.pendingGrading}
                </span>
              )}
            </button>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={onOpenCpanelModal}
            className="w-full py-2.5 px-3 text-xs font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 rounded-lg flex items-center gap-2 hover:bg-emerald-900/50 transition-colors cursor-pointer"
          >
            <Server className="w-4 h-4 text-emerald-400" />
            cPanel & DirectAdmin Hub
          </button>
          <button
            onClick={onNavigateHome}
            className="w-full py-2 px-3 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Public Website
          </button>
          <button
            onClick={onLogout}
            className="w-full py-2 px-3 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout Admin
          </button>
        </div>
      </aside>

      {/* Main Admin Content */}
      <main className="flex-1 p-6 sm:p-10 max-w-6xl overflow-y-auto">
        {/* 1. ADMIN OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in">
            {/* Top Title Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-[#082592] uppercase tracking-wider">
                  Real Database Records
                </span>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900">
                  Administrator Dashboard
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Live counts calculated dynamically from the active MySQL / persistent storage records.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddCourseModal(true)}
                  className="py-2.5 px-4 bg-[#082592] hover:bg-[#061A3A] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#F28C18]" />
                  Add New Course
                </button>
                <button
                  onClick={() => setShowAddAssignmentModal(true)}
                  className="py-2.5 px-4 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  New Assignment
                </button>
              </div>
            </div>

            {/* Prominent Real Database Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Highlighted Exact Registered Students Count (Excluding Admin) */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-[#082592]/30 rounded-2xl shadow-xs">
                <div className="text-[11px] font-bold text-[#082592] uppercase tracking-wide">
                  Registered Students
                </div>
                <div className="text-3xl font-heading font-extrabold text-[#061A3A] mt-1 tabular-nums">
                  {stats.totalStudents}
                </div>
                <div className="text-[10px] text-blue-700 font-medium mt-0.5">
                  Excludes Admin accounts
                </div>
              </div>

              <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
                <div className="text-[11px] font-semibold text-slate-500">Available Courses</div>
                <div className="text-2xl font-heading font-extrabold text-[#082592] mt-1 tabular-nums">
                  {stats.totalCourses}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Active curriculum</div>
              </div>

              <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
                <div className="text-[11px] font-semibold text-slate-500">Total Enrolments</div>
                <div className="text-2xl font-heading font-extrabold text-blue-600 mt-1 tabular-nums">
                  {stats.totalEnrolments}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Student course links</div>
              </div>

              <div className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
                <div className="text-[11px] font-semibold text-slate-500">Submissions</div>
                <div className="text-2xl font-heading font-extrabold text-slate-800 mt-1 tabular-nums">
                  {stats.totalSubmissions}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Uploaded projects</div>
              </div>

              <div className="p-4 bg-white border border-amber-200 bg-amber-50/40 rounded-2xl shadow-2xs">
                <div className="text-[11px] font-semibold text-amber-800">Pending Review</div>
                <div className="text-2xl font-heading font-extrabold text-[#F28C18] mt-1 tabular-nums">
                  {stats.pendingGrading}
                </div>
                <div className="text-[10px] text-amber-700 mt-0.5">Awaiting grading</div>
              </div>

              <div className="p-4 bg-white border border-emerald-200 bg-emerald-50/40 rounded-2xl shadow-2xs">
                <div className="text-[11px] font-semibold text-emerald-800">Graded Work</div>
                <div className="text-2xl font-heading font-extrabold text-emerald-600 mt-1 tabular-nums">
                  {stats.completedGraded}
                </div>
                <div className="text-[10px] text-emerald-700 mt-0.5">Score & feedback given</div>
              </div>
            </div>

            {/* Quick Action Shortcuts & Recent Submissions */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Recent Pending Submissions */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-base text-slate-900">
                      Recent Student Submissions Needing Review
                    </h3>
                    <p className="text-xs text-slate-500">Grading queue for assignments</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('grading')}
                    className="text-xs font-bold text-[#082592] hover:underline"
                  >
                    View All ({submissions.length})
                  </button>
                </div>

                {submissions.length === 0 ? (
                  <p className="text-xs text-slate-500 p-6 text-center">No assignment submissions yet.</p>
                ) : (
                  <div className="space-y-3">
                    {submissions.slice(0, 4).map((sub) => (
                      <div key={sub.id} className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3 hover:bg-slate-50">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{sub.student_name}</span>
                            <span className="text-[10px] text-slate-400">({sub.student_email})</span>
                          </div>
                          <div className="text-xs text-[#082592] font-medium">{sub.assignment_title}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            File: {sub.file_name} ({sub.file_size}) · Submitted: {new Date(sub.submitted_at).toLocaleDateString()}
                          </div>
                        </div>

                        {sub.status === 'Graded' ? (
                          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold">
                            Score: {sub.score}/100 ({sub.grade})
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setGradingSubmission(sub);
                              setGradeScore(90);
                              setGradeFeedback('');
                            }}
                            className="py-1.5 px-3 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-lg cursor-pointer"
                          >
                            Grade Now
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* System Architecture & Hosting Banner */}
              <div className="lg:col-span-4 bg-gradient-to-br from-[#061A3A] to-[#082592] text-white rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Server className="w-5 h-5 text-[#F28C18]" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-white">
                    cPanel Shared Hosting Ready
                  </h3>
                  <p className="text-xs text-blue-100/90 leading-relaxed">
                    DevGenius Academy is architected for zero-Node.js Apache environments using standard PHP 8.1+ PDO and MySQL.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                  <div className="flex items-center justify-between text-blue-200">
                    <span>Database Engine:</span>
                    <span className="font-bold text-white">MySQL / InnoDB</span>
                  </div>
                  <div className="flex items-center justify-between text-blue-200">
                    <span>Tables Seeded:</span>
                    <span className="font-bold text-white">8 Tables</span>
                  </div>
                  <div className="flex items-center justify-between text-blue-200">
                    <span>Admin Security:</span>
                    <span className="font-bold text-white">Bcrypt Passwords</span>
                  </div>

                  <button
                    onClick={onOpenCpanelModal}
                    className="w-full mt-3 py-2 px-3 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Open cPanel Export Hub
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MANAGE STUDENTS TAB */}
        {activeTab === 'students' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-heading font-extrabold text-slate-900">
                  Registered Students ({students.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  View all student accounts, their contact details, enrolled courses, and submissions.
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Enrolled Courses</th>
                      <th className="py-3 px-4">Submissions</th>
                      <th className="py-3 px-4">Joined Date</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students
                      .filter(s => 
                        s.full_name.toLowerCase().includes(studentSearch.toLowerCase()) ||
                        s.email.toLowerCase().includes(studentSearch.toLowerCase())
                      )
                      .map((stu) => {
                        const stuEnrolments = enrolments.filter(e => e.user_id === stu.id);
                        const stuSubmissions = submissions.filter(s => s.user_id === stu.id);

                        return (
                          <tr key={stu.id} className="hover:bg-slate-50/80">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={stu.avatar || '/src/assets/images/hero_student_1793881077112.jpg'}
                                  alt={stu.full_name}
                                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                                />
                                <div>
                                  <div className="font-bold text-slate-900">{stu.full_name}</div>
                                  <div className="text-[10px] text-slate-400">{stu.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              {stu.phone}
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 bg-blue-50 text-[#082592] rounded text-[10px] font-bold">
                                student
                              </span>
                            </td>
                            <td className="py-3 px-4 tabular-nums font-bold text-slate-700">
                              {stuEnrolments.length} Course{stuEnrolments.length !== 1 ? 's' : ''}
                            </td>
                            <td className="py-3 px-4 tabular-nums text-slate-600">
                              {stuSubmissions.length} Submitted
                            </td>
                            <td className="py-3 px-4 text-slate-500">
                              {new Date(stu.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => setSelectedStudent(stu)}
                                className="py-1 px-2.5 text-xs font-semibold text-[#082592] bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
                              >
                                View Profile
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. MANAGE COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-heading font-extrabold text-slate-900">
                  Manage Courses ({courses.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add, edit, activate/deactivate courses and monitor student enrolments.
                </p>
              </div>

              <button
                onClick={() => setShowAddCourseModal(true)}
                className="py-2.5 px-4 bg-[#082592] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 text-[#F28C18]" />
                Add New Course
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
                const courseEnrolmentsCount = enrolments.filter(e => e.course_id === course.id).length;

                return (
                  <div key={course.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                    <div className="relative aspect-16/9 bg-slate-100">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-[#082592] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {course.category}
                      </div>
                      <div className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-bold ${
                        course.is_active ? 'bg-emerald-500 text-white' : 'bg-slate-500 text-white'
                      }`}>
                        {course.is_active ? 'Active' : 'Draft / Inactive'}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>{course.duration}</span>
                          <span className="font-semibold text-slate-700">{course.level}</span>
                        </div>

                        <h4 className="font-heading font-bold text-sm text-slate-900 mt-1 line-clamp-1">
                          {course.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                          {course.description}
                        </p>
                        <div className="text-[11px] text-slate-500 mt-2 font-medium">
                          Instructor: {course.instructor_name}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-400">Enrolled Students</div>
                          <div className="text-base font-extrabold text-[#082592] tabular-nums">
                            {courseEnrolmentsCount}
                          </div>
                        </div>

                        <button
                          onClick={() => toggleCourseStatus(course.id)}
                          className={`py-1.5 px-3 text-xs font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                            course.is_active
                              ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          {course.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. GRADE SUBMISSIONS TAB */}
        {activeTab === 'grading' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-heading font-extrabold text-slate-900">
                  Grade Student Submissions ({submissions.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Inspect student files, assign scores, and provide constructive feedback.
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <select
                  value={gradingStatusFilter}
                  onChange={(e) => setGradingStatusFilter(e.target.value as any)}
                  className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  <option value="All">All Statuses</option>
                  <option value="Submitted">Pending Only</option>
                  <option value="Graded">Graded Only</option>
                </select>

                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white max-w-[200px] truncate"
                >
                  <option value="All">All Courses</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Assignment & Course</th>
                      <th className="py-3 px-4">Attached File</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Score</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredSubmissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{sub.student_name}</div>
                          <div className="text-[10px] text-slate-400">{sub.student_email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800">{sub.assignment_title}</div>
                          <div className="text-[10px] text-slate-500">{sub.course_title}</div>
                        </td>
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <Download className="w-3.5 h-3.5 text-slate-400" />
                            <span>{sub.file_name}</span>
                            <span className="text-slate-400">({sub.file_size})</span>
                          </div>
                          {sub.comments && (
                            <p className="text-[10px] text-slate-500 font-sans italic mt-1 line-clamp-1">
                              &ldquo;{sub.comments}&rdquo;
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {sub.status === 'Graded' ? (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                              Graded
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">
                              Submitted · Pending
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 tabular-nums font-bold">
                          {sub.score !== undefined ? `${sub.score}/100 (${sub.grade})` : '—'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setGradingSubmission(sub);
                              setGradeScore(sub.score || 90);
                              setGradeFeedback(sub.feedback || '');
                            }}
                            className="py-1 px-3 bg-[#F28C18] hover:bg-[#d9770e] text-white font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            {sub.status === 'Graded' ? 'Edit Grade' : 'Grade Submission'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Grade Submission Modal */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#061A3A]/75 backdrop-blur-xs animate-in fade-in">
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-100 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-[#082592] uppercase">
                  Grading Portal · {gradingSubmission.student_name}
                </span>
                <h3 className="font-heading font-bold text-base text-slate-900 mt-0.5">
                  Evaluate Assignment
                </h3>
              </div>
              <button 
                onClick={() => setGradingSubmission(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <div><strong>Assignment:</strong> {gradingSubmission.assignment_title}</div>
              <div><strong>Course:</strong> {gradingSubmission.course_title}</div>
              <div><strong>File:</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-slate-200">{gradingSubmission.file_name}</code></div>
              {gradingSubmission.comments && (
                <div className="text-slate-600 mt-1 italic">
                  Student comments: &ldquo;{gradingSubmission.comments}&rdquo;
                </div>
              )}
            </div>

            {gradeSuccessMessage && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{gradeSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleGradeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Numeric Score (0 - 100)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  required
                  value={gradeScore}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-bold text-base text-[#082592]"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Grade scale: 90+ (A), 85+ (A-), 80+ (B+), 75+ (B), 70+ (B-), 60+ (C).
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Instructor Evaluation & Feedback
                </label>
                <textarea
                  rows={4}
                  required
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="Provide constructive feedback, highlighting strong architectural choices and areas for enhancement..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-[#082592]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="py-2 px-4 text-slate-600 hover:text-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-[#082592] hover:bg-[#061A3A] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4 text-[#F28C18]" />
                  Save Grade & Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#061A3A]/75 backdrop-blur-xs animate-in fade-in">
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-base text-slate-900">
                Add New DevGenius Course
              </h3>
              <button 
                onClick={() => setShowAddCourseModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCourseSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Modern Next.js & Serverless Systems"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Database Management">Database Management</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Instructor</label>
                  <select
                    value={newInstructorName}
                    onChange={(e) => setNewInstructorName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    {instructors.map(i => (
                      <option key={i.id} value={i.name}>{i.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Level</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Comprehensive description of the curriculum outcomes..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddCourseModal(false)}
                  className="py-2 px-4 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-[#082592] text-white font-bold rounded-xl"
                >
                  Add Course to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Assignment Modal */}
      {showAddAssignmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#061A3A]/75 backdrop-blur-xs animate-in fade-in">
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-slate-100 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-base text-slate-900">
                Create New Assignment
              </h3>
              <button 
                onClick={() => setShowAddAssignmentModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddAssignmentSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Course</label>
                <select
                  value={asgCourseId}
                  onChange={(e) => setAsgCourseId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={asgTitle}
                  onChange={(e) => setAsgTitle(e.target.value)}
                  placeholder="e.g. Capstone: E-Commerce API with MySQL"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={asgDueDate}
                    onChange={(e) => setAsgDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Max Score</label>
                  <input
                    type="number"
                    value={asgMaxScore}
                    onChange={(e) => setAsgMaxScore(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Task Requirements & Instructions</label>
                <textarea
                  rows={4}
                  required
                  value={asgDescription}
                  onChange={(e) => setAsgDescription(e.target.value)}
                  placeholder="Detailed instructions for the student submission..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddAssignmentModal(false)}
                  className="py-2 px-4 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-[#F28C18] text-white font-bold rounded-xl"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Selected Student Profile Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#061A3A]/75 backdrop-blur-xs animate-in fade-in">
          <div 
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-heading font-bold text-base text-slate-900">
                Student Record Details
              </h3>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3">
              <img
                src={selectedStudent.avatar || '/src/assets/images/hero_student_1793881077112.jpg'}
                alt={selectedStudent.full_name}
                className="w-14 h-14 rounded-full object-cover border-2 border-slate-200"
              />
              <div>
                <h4 className="font-heading font-bold text-base text-slate-900">{selectedStudent.full_name}</h4>
                <div className="text-xs text-slate-500">{selectedStudent.email}</div>
                <div className="text-xs text-slate-500">{selectedStudent.phone}</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-2">
              <div className="font-bold text-slate-700">Enrolled Courses:</div>
              {enrolments.filter(e => e.user_id === selectedStudent.id).map(enr => {
                const c = courses.find(course => course.id === enr.course_id);
                return (
                  <div key={enr.id} className="flex justify-between items-center text-slate-600 bg-white p-2 rounded border border-slate-200">
                    <span className="font-medium truncate max-w-[200px]">{c?.title}</span>
                    <span className="font-bold text-[#082592]">{enr.progress_percent}%</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="py-2 px-4 bg-[#082592] text-white text-xs font-bold rounded-lg"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
