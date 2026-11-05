import React from 'react';
import { 
  Code2, Terminal, Palette, TrendingUp, 
  Database, Laptop, ArrowRight 
} from 'lucide-react';
import { CATEGORIES } from '../../data/initialData';

interface CourseCategoriesProps {
  onSelectCategory: (categoryName: string) => void;
}

export const CourseCategories: React.FC<CourseCategoriesProps> = ({
  onSelectCategory
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Code': return <Code2 className="w-6 h-6 text-[#082592]" />;
      case 'Terminal': return <Terminal className="w-6 h-6 text-[#082592]" />;
      case 'Palette': return <Palette className="w-6 h-6 text-[#082592]" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6 text-[#082592]" />;
      case 'Database': return <Database className="w-6 h-6 text-[#082592]" />;
      case 'Laptop': return <Laptop className="w-6 h-6 text-[#082592]" />;
      default: return <Code2 className="w-6 h-6 text-[#082592]" />;
    }
  };

  return (
    <section className="py-20 bg-[#F2F6FF]/60 border-y border-blue-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-[#082592] uppercase tracking-wider">
              Browse Categories
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-[#061A3A] tracking-tight mt-1">
              Top Course Categories
            </h2>
          </div>
          <button
            onClick={() => onSelectCategory('All')}
            className="text-xs font-bold text-[#082592] hover:text-[#F28C18] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            Explore All Categories
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              onClick={() => onSelectCategory(cat.name)}
              className="group p-5 bg-white rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-lg hover:border-[#082592]/40 transition-all duration-300 flex flex-col items-center text-center cursor-pointer hover:-translate-y-1"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#F2F6FF] group-hover:bg-[#082592] group-hover:text-white flex items-center justify-center transition-all mb-4">
                <div className="group-hover:text-white transition-colors">
                  {getIcon(cat.icon)}
                </div>
              </div>
              <h3 className="text-sm font-heading font-bold text-slate-900 group-hover:text-[#082592] transition-colors mb-1">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {cat.count} Courses
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
