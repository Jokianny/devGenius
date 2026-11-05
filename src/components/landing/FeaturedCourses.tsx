import React, { useState } from 'react';
import { 
  Clock, BarChart3, Star, ArrowRight, CheckCircle2, 
  BookOpen, Sparkles, User as UserIcon 
} from 'lucide-react';
import { Course, User } from '../../types';

interface FeaturedCoursesProps {
  courses: Course[];
  currentUser: User | null;
  enrolledCourseIds: string[];
  onSelectCourse: (course: Course) => void;
  onEnrolCourse: (courseId: string) => void;
  onViewAllCourses: () => void;
}

export const FeaturedCourses: React.FC<FeaturedCoursesProps> = ({
  courses,
  currentUser: _currentUser,
  enrolledCourseIds,
  onSelectCourse,
  onEnrolCourse,
  onViewAllCourses
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Web Development', 'Programming', 'Design', 'Digital Marketing', 'Database Management'];

  const filteredCourses = selectedCategory === 'All' 
    ? courses 
    : courses.filter(c => c.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <section id="featured-courses" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 text-[#082592] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F28C18]" />
            Featured Courses
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#061A3A] tracking-tight">
            Explore Our Featured Courses
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Discover our most popular courses designed to help you learn new skills and advance your career.
          </p>
        </div>

        {/* Category Filter Pills / Tabs */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#082592] text-white shadow-md shadow-blue-900/10'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Courses Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => {
            const isEnrolled = enrolledCourseIds.includes(course.id);

            return (
              <div
                key={course.id}
                className="group bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1"
              >
                {/* Thumbnail Frame */}
                <div 
                  className="relative aspect-16/9 overflow-hidden bg-slate-100 cursor-pointer"
                  onClick={() => onSelectCourse(course)}
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {/* Category Chip */}
                  <div className="absolute top-3 left-3 bg-[#082592]/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                    {course.category}
                  </div>

                  {/* Level Tag */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-slate-800 text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-xs">
                    {course.level}
                  </div>
                </div>

                {/* Content Box */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    {/* Meta info: duration and level */}
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {course.duration}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                        {course.level}
                      </span>
                    </div>

                    {/* Course Title */}
                    <h3 
                      onClick={() => onSelectCourse(course)}
                      className="font-heading font-bold text-lg text-slate-900 group-hover:text-[#082592] transition-colors line-clamp-2 cursor-pointer"
                    >
                      {course.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Instructor Info */}
                    <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <UserIcon className="w-3.5 h-3.5 text-[#082592]" />
                        <span>{course.instructor_name}</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{course.rating.toFixed(1)}</span>
                        <span className="text-slate-400 font-normal">({course.review_count})</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Action Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-slate-400 line-through">
                        {course.original_price ? `$${course.original_price}.00` : ''}
                      </div>
                      <div className="text-xl font-heading font-extrabold text-[#082592]">
                        ${course.price}.00
                      </div>
                    </div>

                    {isEnrolled ? (
                      <button
                        onClick={() => onSelectCourse(course)}
                        className="py-2 px-3.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 flex items-center gap-1.5 cursor-pointer hover:bg-emerald-100 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Enrolled
                      </button>
                    ) : (
                      <button
                        onClick={() => onEnrolCourse(course.id)}
                        className="py-2.5 px-4 bg-[#F28C18] hover:bg-[#d9770e] text-white text-xs font-bold rounded-lg shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
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

        {/* View All Courses Button */}
        <div className="mt-14 text-center">
          <button
            onClick={onViewAllCourses}
            className="px-8 py-3.5 bg-[#082592] hover:bg-[#061A3A] text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#F28C18]" />
            View All Courses
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
