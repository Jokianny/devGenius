import { User, Course, Instructor, Assignment, AssignmentSubmission, CourseEnrolment } from '../types';

export const INITIAL_INSTRUCTORS: Instructor[] = [
  {
    id: 'inst-1',
    name: 'Dr. David Adeleke',
    role_title: 'Head of Software Architecture & Cloud',
    bio: 'Former principal engineer with 14+ years designing high-scale distributed systems and mentoring over 8,000 developers across Africa and Europe.',
    specialization: 'Full-Stack & Cloud Architecture',
    avatar: '/src/assets/images/instructor_lead_1793881080008.jpg',
    email: 'david.adeleke@devgenius.academy',
    rating: 4.9,
    students_count: 5400
  },
  {
    id: 'inst-2',
    name: 'Amina Yusuf',
    role_title: 'Lead Product & UX Design Strategist',
    bio: 'Product design consultant with extensive experience leading UI/UX transformations for high-growth tech startups and financial platforms.',
    specialization: 'Design Systems & UX Research',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    email: 'amina.yusuf@devgenius.academy',
    rating: 4.8,
    students_count: 3200
  },
  {
    id: 'inst-3',
    name: 'Dr. Marcus Chen',
    role_title: 'Senior AI & Data Science Researcher',
    bio: 'Specialist in machine learning pipelines, predictive modeling, and applied Python solutions for enterprise data analytics.',
    specialization: 'Python, ML & Algorithms',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    email: 'marcus.chen@devgenius.academy',
    rating: 4.9,
    students_count: 4100
  },
  {
    id: 'inst-4',
    name: 'Grace Okafor',
    role_title: 'Growth Director & Digital Strategist',
    bio: 'Performance marketing specialist certified in Google, Meta, and SEO analytics with a proven track record in revenue growth.',
    specialization: 'Digital Marketing & Growth Funnels',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    email: 'grace.okafor@devgenius.academy',
    rating: 4.7,
    students_count: 2800
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Full-Stack Web Development Bootcamp',
    slug: 'web-development-bootcamp',
    category: 'Web Development',
    description: 'Master modern frontend and backend development from semantic HTML5 and modern CSS to responsive React, server-side APIs, and database persistence.',
    instructor_id: 'inst-1',
    instructor_name: 'Dr. David Adeleke',
    duration: '12 Weeks',
    level: 'Beginner',
    price: 49,
    original_price: 89,
    thumbnail: '/src/assets/images/course_web_dev_1793881077580.jpg',
    rating: 4.8,
    review_count: 120,
    is_active: true,
    featured: true,
    created_at: '2026-01-10T08:00:00Z',
    syllabus: [
      {
        week: 1,
        title: 'HTML5, Modern CSS & Responsive Layouts',
        topics: ['Semantic markup & accessibility', 'Flexbox & CSS Grid systems', 'Mobile-first breakpoints', 'CSS custom variables']
      },
      {
        week: 2,
        title: 'JavaScript Essentials & DOM Manipulation',
        topics: ['ES6+ syntax & async/await', 'Event handling & form validation', 'Fetch API & JSON handling', 'Local storage persistence']
      },
      {
        week: 3,
        title: 'Modern Frontend with React & Tailwind',
        topics: ['Component lifecycle & hooks', 'State management patterns', 'Styling with Tailwind CSS', 'Modular architecture']
      },
      {
        week: 4,
        title: 'Server APIs & Database Integration',
        topics: ['RESTful API architecture', 'MySQL schema design & PDO', 'Authentication & sessions', 'Full deployment to hosting']
      }
    ]
  },
  {
    id: 'course-2',
    title: 'Python Programming & AI Fundamentals',
    slug: 'python-programming-from-scratch',
    category: 'Programming',
    description: 'Learn Python from foundational syntax and object-oriented programming to data analysis with Pandas, NumPy, and introductory AI algorithms.',
    instructor_id: 'inst-3',
    instructor_name: 'Dr. Marcus Chen',
    duration: '14 Weeks',
    level: 'Beginner',
    price: 59,
    original_price: 110,
    thumbnail: '/src/assets/images/course_python_1793881079503.jpg',
    rating: 4.9,
    review_count: 150,
    is_active: true,
    featured: true,
    created_at: '2026-01-15T09:30:00Z',
    syllabus: [
      {
        week: 1,
        title: 'Python Core Fundamentals',
        topics: ['Variables, data types & operators', 'Control flow & functions', 'Lists, tuples & dictionaries', 'Exception handling']
      },
      {
        week: 2,
        title: 'Object-Oriented Programming & File I/O',
        topics: ['Classes, methods & inheritance', 'Polymorphism & encapsulation', 'Working with CSV and JSON files', 'Virtual environments']
      },
      {
        week: 3,
        title: 'Data Science Foundations with NumPy & Pandas',
        topics: ['Array operations with NumPy', 'DataFrames & cleaning in Pandas', 'Exploratory data analysis', 'Data visualization with Matplotlib']
      },
      {
        week: 4,
        title: 'Applied Machine Learning & Project Capstone',
        topics: ['Regression & classification basics', 'Model evaluation metrics', 'Building an automated analysis tool', 'Final capstone defense']
      }
    ]
  },
  {
    id: 'course-3',
    title: 'UI/UX Design Fundamentals & Design Systems',
    slug: 'ui-ux-design-fundamentals',
    category: 'Design',
    description: 'Craft intuitive, accessible user experiences. Learn user research, interactive wireframing, high-fidelity Figma prototyping, and design tokens.',
    instructor_id: 'inst-2',
    instructor_name: 'Amina Yusuf',
    duration: '8 Weeks',
    level: 'Beginner',
    price: 29,
    original_price: 60,
    thumbnail: '/src/assets/images/course_ui_ux_1793881078359.jpg',
    rating: 4.8,
    review_count: 85,
    is_active: true,
    featured: true,
    created_at: '2026-01-20T11:00:00Z',
    syllabus: [
      {
        week: 1,
        title: 'User Research & Information Architecture',
        topics: ['User personas & journey maps', 'Competitor benchmarking', 'Card sorting & sitemaps', 'User interviews & qualitative analysis']
      },
      {
        week: 2,
        title: 'Wireframing & Usability Testing',
        topics: ['Low-fidelity sketching', 'Interactive wireframes in Figma', 'Usability testing sessions', 'Iterative feedback cycles']
      },
      {
        week: 3,
        title: 'High-Fidelity Visual Design & Components',
        topics: ['Typographic scale & grid math', 'Accessible color systems (WCAG)', 'Reusable component variants', 'Micro-interactions & transitions']
      },
      {
        week: 4,
        title: 'Design Systems & Developer Handoff',
        topics: ['Design token nomenclature', 'Auto Layout & constraints', 'Handoff documentation', 'Portfolio case study presentation']
      }
    ]
  },
  {
    id: 'course-4',
    title: 'Digital Marketing & Growth Masterclass',
    slug: 'digital-marketing-masterclass',
    category: 'Digital Marketing',
    description: 'Accelerate brand growth with data-driven marketing: SEO, conversion rate optimization, Google Ads, content marketing, and email funnels.',
    instructor_id: 'inst-4',
    instructor_name: 'Grace Okafor',
    duration: '10 Weeks',
    level: 'Intermediate',
    price: 39,
    original_price: 79,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    review_count: 95,
    is_active: true,
    featured: true,
    created_at: '2026-02-01T14:00:00Z',
    syllabus: [
      {
        week: 1,
        title: 'Search Engine Optimization (SEO)',
        topics: ['Keyword research & search intent', 'On-page SEO optimization', 'Technical audits & schema markup', 'High-authority backlink strategy']
      },
      {
        week: 2,
        title: 'Performance Advertising & Funnels',
        topics: ['Google Search & Display campaigns', 'Meta Ads Manager targeting', 'A/B testing ad creatives', 'Cost per acquisition optimization']
      },
      {
        week: 3,
        title: 'Content Strategy & Email Marketing',
        topics: ['High-converting landing pages', 'Automated email sequences', 'Lead magnet design', 'Copywriting psychology']
      },
      {
        week: 4,
        title: 'Analytics, Reporting & ROI Tracking',
        topics: ['Google Analytics 4 event setup', 'Attribution models', 'Custom executive dashboards', 'Client pitch presentation']
      }
    ]
  },
  {
    id: 'course-5',
    title: 'Relational Database Management & SQL',
    slug: 'database-management-sql',
    category: 'Database Management',
    description: 'Design robust relational database schemas, write high-performance SQL queries, optimize indexes, and ensure data integrity in MySQL and PostgreSQL.',
    instructor_id: 'inst-1',
    instructor_name: 'Dr. David Adeleke',
    duration: '8 Weeks',
    level: 'Intermediate',
    price: 35,
    original_price: 70,
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    review_count: 74,
    is_active: true,
    featured: false,
    created_at: '2026-02-10T10:00:00Z',
    syllabus: [
      {
        week: 1,
        title: 'Relational Modeling & Normalization',
        topics: ['Entity Relationship Diagrams (ERD)', '1NF, 2NF, 3NF Normalization', 'Primary & Foreign key constraints', 'Data types & table creation']
      },
      {
        week: 2,
        title: 'Advanced SQL Querying',
        topics: ['Complex JOINs (Inner, Left, Cross)', 'Aggregations & Group By', 'Subqueries & Common Table Expressions', 'Window functions']
      },
      {
        week: 3,
        title: 'Indexing & Performance Optimization',
        topics: ['B-Tree indexes & composite indexes', 'EXPLAIN query plans', 'Transaction management & ACID', 'Locking mechanisms']
      },
      {
        week: 4,
        title: 'Database Security & Hosting Backups',
        topics: ['User privilege management', 'SQL injection mitigation via PDO', 'Automated backups with mysqldump', 'Replication basics']
      }
    ]
  },
  {
    id: 'course-6',
    title: 'Graphics Design & Brand Identity Mastery',
    slug: 'graphics-design-brand-identity',
    category: 'Design',
    description: 'Transform brand visions into unforgettable visual identities. Learn vector illustration, typographic harmony, color psychology, and print production.',
    instructor_id: 'inst-2',
    instructor_name: 'Amina Yusuf',
    duration: '6 Weeks',
    level: 'Beginner',
    price: 30,
    original_price: 65,
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    review_count: 62,
    is_active: true,
    featured: false,
    created_at: '2026-02-15T12:00:00Z',
    syllabus: [
      {
        week: 1,
        title: 'Foundations of Visual Design',
        topics: ['Composition, balance & contrast', 'Color theory & emotion', 'Vector graphics vs raster images', 'Typography essentials']
      },
      {
        week: 2,
        title: 'Logo Design & Monogram Architecture',
        topics: ['Brainstorming & thumbnail sketches', 'Vectorization & grid alignment', 'Monogram creation & emblem craft', 'Export formats (SVG, PNG, PDF)']
      },
      {
        week: 3,
        title: 'Brand Collateral & Stationery',
        topics: ['Business card & letterhead layouts', 'Social media kit production', 'Packaging design basics', 'Mockup generation']
      },
      {
        week: 4,
        title: 'Brand Guidelines Style Guide',
        topics: ['Compiling a comprehensive brand book', 'Clear space & color rules', 'Typography usage standards', 'Client presentation']
      }
    ]
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin-1',
    full_name: 'System Administrator',
    email: 'admin@devgenius.academy',
    phone: '+1 (800) 456-7890',
    role: 'admin',
    created_at: '2026-01-01T00:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    bio: 'Lead System Administrator at DevGenius Academy.'
  },
  {
    id: 'usr-student-1',
    full_name: 'Sarah Mensah',
    email: 'sarah.mensah@example.com',
    phone: '+234 802 345 6789',
    role: 'student',
    created_at: '2026-02-10T09:15:00Z',
    avatar: '/src/assets/images/hero_student_1793881077112.jpg',
    bio: 'Aspiring full-stack web developer passionate about high-impact edtech solutions.'
  },
  {
    id: 'usr-student-2',
    full_name: 'Emmanuel Osei',
    email: 'emmanuel.osei@example.com',
    phone: '+233 24 567 8901',
    role: 'student',
    created_at: '2026-02-12T14:20:00Z',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    bio: 'Tech enthusiast learning Python for data analysis and machine learning.'
  },
  {
    id: 'usr-student-3',
    full_name: 'Zainab Bello',
    email: 'zainab.bello@example.com',
    phone: '+234 813 456 7890',
    role: 'student',
    created_at: '2026-02-18T16:45:00Z',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    bio: 'Junior product designer mastering design systems and user research.'
  }
];

export const INITIAL_ENROLMENTS: CourseEnrolment[] = [
  {
    id: 'enr-1',
    user_id: 'usr-student-1',
    course_id: 'course-1',
    enrolled_at: '2026-02-10T09:30:00Z',
    progress_percent: 65,
    status: 'active',
    completed_lessons: 13,
    total_lessons: 20
  },
  {
    id: 'enr-2',
    user_id: 'usr-student-1',
    course_id: 'course-3',
    enrolled_at: '2026-02-11T10:00:00Z',
    progress_percent: 40,
    status: 'active',
    completed_lessons: 6,
    total_lessons: 16
  },
  {
    id: 'enr-3',
    user_id: 'usr-student-2',
    course_id: 'course-2',
    enrolled_at: '2026-02-12T15:00:00Z',
    progress_percent: 50,
    status: 'active',
    completed_lessons: 8,
    total_lessons: 16
  },
  {
    id: 'enr-4',
    user_id: 'usr-student-3',
    course_id: 'course-3',
    enrolled_at: '2026-02-18T17:00:00Z',
    progress_percent: 25,
    status: 'active',
    completed_lessons: 4,
    total_lessons: 16
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-1',
    course_id: 'course-1',
    course_title: 'Full-Stack Web Development Bootcamp',
    title: 'Assignment 1: Responsive Portfolio Website',
    description: 'Design and build a responsive personal portfolio using semantic HTML5, Flexbox, and CSS Grid. Must include a working contact form and mobile menu. Submit a ZIP file or hosted repository link with documentation.',
    due_date: '2026-03-15T23:59:59Z',
    max_score: 100,
    created_at: '2026-02-12T08:00:00Z'
  },
  {
    id: 'asg-2',
    course_id: 'course-1',
    course_title: 'Full-Stack Web Development Bootcamp',
    title: 'Assignment 2: JavaScript Interactive Task Manager',
    description: 'Implement a task management dashboard with local storage persistence, filtering (All/Active/Completed), and form validation using modern ES6+ modules.',
    due_date: '2026-03-25T23:59:59Z',
    max_score: 100,
    created_at: '2026-02-15T08:00:00Z'
  },
  {
    id: 'asg-3',
    course_id: 'course-3',
    course_title: 'UI/UX Design Fundamentals & Design Systems',
    title: 'Assignment 1: E-Learning Mobile App Wireframes & Flow',
    description: 'Create low-fidelity and mid-fidelity interactive wireframes for an e-learning student dashboard in Figma. Include user flow annotations and submit as PDF or Figma link.',
    due_date: '2026-03-20T23:59:59Z',
    max_score: 100,
    created_at: '2026-02-14T10:00:00Z'
  },
  {
    id: 'asg-4',
    course_id: 'course-2',
    course_title: 'Python Programming & AI Fundamentals',
    title: 'Assignment 1: Student Gradebook Analyzer in Python',
    description: 'Write a Python script that reads student records from a CSV file, computes average marks, finds the highest and lowest performers, and exports a formatted grade report.',
    due_date: '2026-03-18T23:59:59Z',
    max_score: 100,
    created_at: '2026-02-16T12:00:00Z'
  }
];

export const INITIAL_SUBMISSIONS: AssignmentSubmission[] = [
  {
    id: 'sub-1',
    assignment_id: 'asg-1',
    assignment_title: 'Assignment 1: Responsive Portfolio Website',
    course_id: 'course-1',
    course_title: 'Full-Stack Web Development Bootcamp',
    user_id: 'usr-student-1',
    student_name: 'Sarah Mensah',
    student_email: 'sarah.mensah@example.com',
    file_name: 'sarah_portfolio_v1.zip',
    file_size: '2.4 MB',
    comments: 'Completed responsive layout with mobile drawer and light/dark theme toggle. Tested on Chrome, Firefox, and mobile viewport.',
    submitted_at: '2026-02-28T14:32:00Z',
    status: 'Graded',
    score: 95,
    grade: 'A',
    feedback: 'Outstanding implementation! The semantic structure is clean, accessibility labels are in place, and the mobile navigation operates smoothly.',
    graded_at: '2026-03-02T10:15:00Z'
  },
  {
    id: 'sub-2',
    assignment_id: 'asg-3',
    assignment_title: 'Assignment 1: E-Learning Mobile App Wireframes & Flow',
    course_id: 'course-3',
    course_title: 'UI/UX Design Fundamentals & Design Systems',
    user_id: 'usr-student-1',
    student_name: 'Sarah Mensah',
    student_email: 'sarah.mensah@example.com',
    file_name: 'elearning_wireframes_figma_export.pdf',
    file_size: '5.1 MB',
    comments: 'Attached PDF export showing 12 screens from student onboarding to course enrolment and assignment submission.',
    submitted_at: '2026-03-04T18:20:00Z',
    status: 'Submitted'
  },
  {
    id: 'sub-3',
    assignment_id: 'asg-4',
    assignment_title: 'Assignment 1: Student Gradebook Analyzer in Python',
    course_id: 'course-2',
    course_title: 'Python Programming & AI Fundamentals',
    user_id: 'usr-student-2',
    student_name: 'Emmanuel Osei',
    student_email: 'emmanuel.osei@example.com',
    file_name: 'gradebook_analyzer_emmanuel.py',
    file_size: '14 KB',
    comments: 'Created modular script with error handling for malformed rows and summary statistics printing.',
    submitted_at: '2026-03-03T11:45:00Z',
    status: 'Graded',
    score: 88,
    grade: 'B+',
    feedback: 'Well-structured code and good modularity. Consider adding docstrings to all functions for enterprise best practice.',
    graded_at: '2026-03-04T09:00:00Z'
  }
];

export const CATEGORIES = [
  { name: 'Web Development', icon: 'Code', count: 24, description: 'HTML, CSS, React, Node.js & PHP' },
  { name: 'Programming', icon: 'Terminal', count: 18, description: 'Python, C++, Java & Algorithms' },
  { name: 'Design', icon: 'Palette', count: 16, description: 'UI/UX, Figma, Brand Systems' },
  { name: 'Digital Marketing', icon: 'TrendingUp', count: 14, description: 'SEO, Performance Ads & Funnels' },
  { name: 'Data Science', icon: 'Database', count: 12, description: 'Analytics, Machine Learning & SQL' },
  { name: 'Computer Appreciation', icon: 'Laptop', count: 8, description: 'Productivity, Cloud Tools & Office' },
];

export const FAQS = [
  {
    q: 'How do I register as a student?',
    a: 'Click the "Get Started" or "Sign In" button in the top navigation bar. Select the "Register" tab, enter your Full Name, Email Address, Phone Number, and choose a secure password. Once registered, your student account is created instantly and you can immediately begin browsing and enrolling in courses.'
  },
  {
    q: 'How do I enrol in a course?',
    a: 'Browse the course catalog on the landing page or student dashboard. Click on any course to review its comprehensive syllabus, instructor qualifications, and requirements. Then click "Enrol Now". The course is immediately added to your "My Courses" tab with zero friction.'
  },
  {
    q: 'Can I take multiple courses at the same time?',
    a: 'Yes! DevGenius Academy allows students to enrol in as many active courses as they wish. You can track your progress, upcoming deadlines, and grades across all your enrolled tracks independently from your student dashboard.'
  },
  {
    q: 'How do I submit assignments and what formats are accepted?',
    a: 'Navigate to "Assignments" in your student dashboard. Find the pending assignment, click "Submit", attach your file (PDF, DOCX, ZIP, PY, JS, etc. up to 25MB), and add any relevant notes or repository links for your instructor. Your submission is recorded with an exact timestamp.'
  },
  {
    q: 'How and when do I view my grades and instructor feedback?',
    a: 'Once an instructor evaluates your work, your submission status changes from "Submitted" to "Graded". Head to "My Results" in your dashboard to see your numerical score (out of 100), letter grade (A+, A, B, etc.), and personalized feedback explaining what you did well and areas for improvement.'
  }
];
