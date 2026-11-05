import { 
  User, Course, CourseEnrolment, Assignment, 
  AssignmentSubmission, Instructor, PlatformStats, 
  NewsletterSubscriber 
} from '../types';
import { 
  INITIAL_USERS, INITIAL_COURSES, INITIAL_ENROLMENTS, 
  INITIAL_ASSIGNMENTS, INITIAL_SUBMISSIONS, INITIAL_INSTRUCTORS 
} from '../data/initialData';

const STORAGE_KEYS = {
  USERS: 'devgenius_users',
  CURRENT_USER: 'devgenius_current_user',
  COURSES: 'devgenius_courses',
  ENROLMENTS: 'devgenius_enrolments',
  ASSIGNMENTS: 'devgenius_assignments',
  SUBMISSIONS: 'devgenius_submissions',
  INSTRUCTORS: 'devgenius_instructors',
  NEWSLETTER: 'devgenius_newsletter',
  INITIALIZED: 'devgenius_db_v1_init'
};

class DatabaseService {
  constructor() {
    this.initDatabase();
  }

  private initDatabase() {
    if (typeof window === 'undefined') return;

    if (!localStorage.getItem(STORAGE_KEYS.INITIALIZED)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
      localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(INITIAL_COURSES));
      localStorage.setItem(STORAGE_KEYS.ENROLMENTS, JSON.stringify(INITIAL_ENROLMENTS));
      localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(INITIAL_ASSIGNMENTS));
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
      localStorage.setItem(STORAGE_KEYS.INSTRUCTORS, JSON.stringify(INITIAL_INSTRUCTORS));
      localStorage.setItem(STORAGE_KEYS.NEWSLETTER, JSON.stringify([]));
      // Set default demo current user to Sarah Mensah (student) or null
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[1]));
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  }

  private notifyUpdate() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('devgenius_db_update'));
    }
  }

  // --- STATS (Dynamic & Real Calculation) ---
  getPlatformStats(): PlatformStats {
    const users = this.getUsers();
    const courses = this.getCourses();
    const enrolments = this.getEnrolments();
    const submissions = this.getSubmissions();

    // Strict requirement: COUNT ONLY student-role accounts, excluding administrator accounts!
    const studentCount = users.filter(u => u.role === 'student').length;
    const activeCoursesCount = courses.filter(c => c.is_active).length;
    const pendingGradingCount = submissions.filter(s => s.status === 'Submitted').length;
    const completedGradedCount = submissions.filter(s => s.status === 'Graded').length;

    return {
      totalStudents: studentCount,
      totalCourses: activeCoursesCount,
      totalEnrolments: enrolments.length,
      totalSubmissions: submissions.length,
      pendingGrading: pendingGradingCount,
      completedGraded: completedGradedCount
    };
  }

  // --- AUTH & USERS ---
  getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    this.notifyUpdate();
  }

  login(email: string, pass: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      return { success: false, message: 'Invalid credentials. User with this email was not found.' };
    }

    // In production PHP, password_hash() and password_verify() are used.
    // Here we validate presence and allow demo access with standard credentials.
    if (!pass || pass.length < 4) {
      return { success: false, message: 'Please enter a valid password (minimum 4 characters).' };
    }

    this.setCurrentUser(user);
    return { success: true, message: 'Login successful!', user };
  }

  register(data: { full_name: string; email: string; phone: string; password: string }): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const normalizedEmail = data.email.trim().toLowerCase();

    // Unique email validation
    if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
      return { success: false, message: 'An account with this email address already exists. Please login instead.' };
    }

    // Role assignment: ALWAYS student to prevent unauthorized privilege escalation
    const newUser: User = {
      id: 'usr-student-' + Date.now(),
      full_name: data.full_name.trim(),
      email: normalizedEmail,
      phone: data.phone.trim(),
      role: 'student',
      created_at: new Date().toISOString(),
      avatar: '/src/assets/images/hero_student_1793881077112.jpg',
      bio: 'Enthusiastic DevGenius Academy student preparing for career growth.'
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(newUser);
    this.notifyUpdate();

    return { success: true, message: 'Student account registered successfully! Welcome to DevGenius Academy.', user: newUser };
  }

  logout(): void {
    this.setCurrentUser(null);
  }

  updateUserProfile(userId: string, updates: Partial<User>): User {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');

    // Prevent tampering with role via profile update
    const { role: _role, ...safeUpdates } = updates;
    users[index] = { ...users[index], ...safeUpdates };

    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      this.setCurrentUser(users[index]);
    } else {
      this.notifyUpdate();
    }
    return users[index];
  }

  // --- COURSES ---
  getCourses(): Course[] {
    const data = localStorage.getItem(STORAGE_KEYS.COURSES);
    return data ? JSON.parse(data) : [];
  }

  getCourseById(id: string): Course | undefined {
    return this.getCourses().find(c => c.id === id);
  }

  addCourse(courseData: Omit<Course, 'id' | 'created_at' | 'rating' | 'review_count'>): Course {
    const courses = this.getCourses();
    const newCourse: Course = {
      ...courseData,
      id: 'course-' + Date.now(),
      created_at: new Date().toISOString(),
      rating: 5.0,
      review_count: 1
    };
    courses.unshift(newCourse);
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    this.notifyUpdate();
    return newCourse;
  }

  updateCourse(id: string, updates: Partial<Course>): Course {
    const courses = this.getCourses();
    const index = courses.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Course not found');

    courses[index] = { ...courses[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    this.notifyUpdate();
    return courses[index];
  }

  toggleCourseStatus(id: string): Course {
    const courses = this.getCourses();
    const index = courses.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Course not found');

    courses[index].is_active = !courses[index].is_active;
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
    this.notifyUpdate();
    return courses[index];
  }

  // --- ENROLMENTS ---
  getEnrolments(): CourseEnrolment[] {
    const data = localStorage.getItem(STORAGE_KEYS.ENROLMENTS);
    return data ? JSON.parse(data) : [];
  }

  getUserEnrolments(userId: string): (CourseEnrolment & { course?: Course })[] {
    const enrolments = this.getEnrolments().filter(e => e.user_id === userId);
    const courses = this.getCourses();
    return enrolments.map(e => ({
      ...e,
      course: courses.find(c => c.id === e.course_id)
    }));
  }

  isUserEnrolled(userId: string, courseId: string): boolean {
    const enrolments = this.getEnrolments();
    return enrolments.some(e => e.user_id === userId && e.course_id === courseId);
  }

  enrolCourse(userId: string, courseId: string): { success: boolean; message: string; enrolment?: CourseEnrolment } {
    const course = this.getCourseById(courseId);
    if (!course) {
      return { success: false, message: 'Course not found.' };
    }
    if (!course.is_active) {
      return { success: false, message: 'This course is currently not active for enrolment.' };
    }

    if (this.isUserEnrolled(userId, courseId)) {
      return { success: false, message: 'You are already enrolled in this course! Check your student dashboard.' };
    }

    const enrolments = this.getEnrolments();
    const newEnrolment: CourseEnrolment = {
      id: 'enr-' + Date.now(),
      user_id: userId,
      course_id: courseId,
      enrolled_at: new Date().toISOString(),
      progress_percent: 0,
      status: 'active',
      completed_lessons: 0,
      total_lessons: 16
    };

    enrolments.push(newEnrolment);
    localStorage.setItem(STORAGE_KEYS.ENROLMENTS, JSON.stringify(enrolments));
    this.notifyUpdate();

    return { success: true, message: `Successfully enrolled in ${course.title}!`, enrolment: newEnrolment };
  }

  updateProgress(enrolmentId: string, progress: number): void {
    const enrolments = this.getEnrolments();
    const index = enrolments.findIndex(e => e.id === enrolmentId);
    if (index !== -1) {
      enrolments[index].progress_percent = Math.min(100, Math.max(0, progress));
      if (enrolments[index].progress_percent >= 100) {
        enrolments[index].status = 'completed';
      }
      localStorage.setItem(STORAGE_KEYS.ENROLMENTS, JSON.stringify(enrolments));
      this.notifyUpdate();
    }
  }

  // --- ASSIGNMENTS ---
  getAssignments(): Assignment[] {
    const data = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    return data ? JSON.parse(data) : [];
  }

  addAssignment(assignmentData: Omit<Assignment, 'id' | 'created_at'>): Assignment {
    const assignments = this.getAssignments();
    const newAssignment: Assignment = {
      ...assignmentData,
      id: 'asg-' + Date.now(),
      created_at: new Date().toISOString()
    };
    assignments.unshift(newAssignment);
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
    this.notifyUpdate();
    return newAssignment;
  }

  // --- SUBMISSIONS ---
  getSubmissions(): AssignmentSubmission[] {
    const data = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    return data ? JSON.parse(data) : [];
  }

  getUserSubmissions(userId: string): AssignmentSubmission[] {
    return this.getSubmissions().filter(s => s.user_id === userId);
  }

  submitAssignment(data: {
    assignment_id: string;
    course_id: string;
    user_id: string;
    file_name: string;
    file_size: string;
    comments: string;
  }): { success: boolean; message: string; submission?: AssignmentSubmission } {
    const user = this.getUsers().find(u => u.id === data.user_id);
    const assignment = this.getAssignments().find(a => a.id === data.assignment_id);
    const course = this.getCourseById(data.course_id);

    if (!user || !assignment || !course) {
      return { success: false, message: 'Invalid assignment or student record.' };
    }

    const submissions = this.getSubmissions();
    const newSubmission: AssignmentSubmission = {
      id: 'sub-' + Date.now(),
      assignment_id: data.assignment_id,
      assignment_title: assignment.title,
      course_id: data.course_id,
      course_title: course.title,
      user_id: data.user_id,
      student_name: user.full_name,
      student_email: user.email,
      file_name: data.file_name,
      file_size: data.file_size,
      comments: data.comments,
      submitted_at: new Date().toISOString(),
      status: 'Submitted'
    };

    submissions.unshift(newSubmission);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    this.notifyUpdate();

    return { 
      success: true, 
      message: 'Assignment submitted successfully! Your instructor will review and grade your work.', 
      submission: newSubmission 
    };
  }

  gradeSubmission(submissionId: string, score: number, feedback: string): { success: boolean; message: string } {
    const submissions = this.getSubmissions();
    const index = submissions.findIndex(s => s.id === submissionId);
    if (index === -1) {
      return { success: false, message: 'Submission not found.' };
    }

    let letterGrade = 'F';
    if (score >= 90) letterGrade = 'A';
    else if (score >= 85) letterGrade = 'A-';
    else if (score >= 80) letterGrade = 'B+';
    else if (score >= 75) letterGrade = 'B';
    else if (score >= 70) letterGrade = 'B-';
    else if (score >= 60) letterGrade = 'C';
    else if (score >= 50) letterGrade = 'D';

    submissions[index].score = score;
    submissions[index].grade = letterGrade;
    submissions[index].feedback = feedback;
    submissions[index].status = 'Graded';
    submissions[index].graded_at = new Date().toISOString();

    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
    this.notifyUpdate();

    return { success: true, message: `Submission graded successfully! Score: ${score}/100 (${letterGrade})` };
  }

  // --- INSTRUCTORS ---
  getInstructors(): Instructor[] {
    const data = localStorage.getItem(STORAGE_KEYS.INSTRUCTORS);
    return data ? JSON.parse(data) : [];
  }

  addInstructor(instructor: Omit<Instructor, 'id'>): Instructor {
    const list = this.getInstructors();
    const newInst: Instructor = {
      ...instructor,
      id: 'inst-' + Date.now(),
      rating: 5.0,
      students_count: 0
    };
    list.push(newInst);
    localStorage.setItem(STORAGE_KEYS.INSTRUCTORS, JSON.stringify(list));
    this.notifyUpdate();
    return newInst;
  }

  // --- NEWSLETTER ---
  subscribeNewsletter(email: string): { success: boolean; message: string } {
    const normalized = email.trim().toLowerCase();
    const data = localStorage.getItem(STORAGE_KEYS.NEWSLETTER);
    const list: NewsletterSubscriber[] = data ? JSON.parse(data) : [];

    if (list.some(s => s.email.toLowerCase() === normalized)) {
      return { success: true, message: 'You are already subscribed to our newsletter!' };
    }

    list.push({
      id: 'sub-' + Date.now(),
      email: normalized,
      subscribed_at: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEYS.NEWSLETTER, JSON.stringify(list));
    return { success: true, message: 'Thank you for subscribing! Check your inbox for modern tech tutorials and updates.' };
  }

  // Reset to seed data
  resetDatabase() {
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
    this.initDatabase();
    this.notifyUpdate();
  }
}

export const db = new DatabaseService();
