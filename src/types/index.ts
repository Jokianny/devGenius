export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: UserRole;
  created_at: string;
  avatar?: string;
  bio?: string;
}

export interface Instructor {
  id: string;
  name: string;
  role_title: string;
  bio: string;
  specialization: string;
  avatar: string;
  email: string;
  rating?: number;
  students_count?: number;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  syllabus: {
    week: number;
    title: string;
    topics: string[];
  }[];
  instructor_id: string;
  instructor_name: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  original_price?: number;
  thumbnail: string;
  rating: number;
  review_count: number;
  is_active: boolean;
  featured?: boolean;
  created_at: string;
}

export interface CourseEnrolment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  progress_percent: number;
  status: 'active' | 'completed';
  completed_lessons?: number;
  total_lessons?: number;
}

export interface Assignment {
  id: string;
  course_id: string;
  course_title: string;
  title: string;
  description: string;
  due_date: string;
  max_score: number;
  created_at: string;
}

export interface AssignmentSubmission {
  id: string;
  assignment_id: string;
  assignment_title: string;
  course_id: string;
  course_title: string;
  user_id: string;
  student_name: string;
  student_email: string;
  file_name: string;
  file_size: string;
  comments: string;
  submitted_at: string;
  status: 'Submitted' | 'Graded';
  score?: number;
  grade?: string;
  feedback?: string;
  graded_at?: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

export interface PlatformStats {
  totalStudents: number;
  totalCourses: number;
  totalEnrolments: number;
  totalSubmissions: number;
  pendingGrading: number;
  completedGraded: number;
}
