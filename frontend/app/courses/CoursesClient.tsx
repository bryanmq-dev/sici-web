'use client';

import React from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import { User, Clock, BookOpen, ArrowUpRight, Search } from 'lucide-react';
import Link from 'next/link';

interface Course {
  id: string;
  name: string;
  description: string;
  duration: string | null;
  syllabus: any;
  category: string | null;
  status: string;
  image: string | null;
  gallery: string[] | null;
  objective: string | null;
  results: string | null;
  relevantInfo: string | null;
  createdAt: Date;
  instructorId: string | null;
  mentorSpecialty: string | null;
  instructorName: string | null;
}

export default function CoursesClient({ courses }: { courses: Course[] }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('Todos');

  const categories = ['Todos', ...Array.from(new Set(courses.map(c => c.category).filter(Boolean)))];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = activeCategory === 'Todos' || course.category === activeCategory;
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (course.instructorName && course.instructorName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar curso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat || 'Todos')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-white'
                  : 'bg-surface-muted text-text-secondary border border-border hover:bg-surface-hover'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.map((course, idx) => {
          const syllabusArray = Array.isArray(course.syllabus) ? course.syllabus : [];

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card overflow-hidden group flex flex-col"
            >
              <div className="aspect-video relative overflow-hidden bg-surface-muted">
                <Image
                  src={course.image || '/placeholder-course.jpg'}
                  alt={course.name}
                  fill
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
                {course.duration && (
                  <div className="absolute bottom-4 left-4">
                    <span className="badge-secondary text-[11px]">{course.duration}</span>
                  </div>
                )}
              </div>

              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors leading-snug mb-1">
                  {course.name}
                </h3>
                <p className="text-xs text-text-muted flex items-center gap-1.5 mb-3">
                  <User className="w-3.5 h-3.5" /> {course.instructorName || 'Por definir'}
                </p>

                <p className="text-sm text-text-secondary line-clamp-3 mb-4 flex-grow">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-xs text-text-muted pt-4 border-t border-border mb-4">
                  <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {syllabusArray.length} módulos</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {course.duration || 'N/A'}</span>
                </div>

                <Link href={`/courses/${course.id}`} className="btn-primary flex items-center justify-center gap-2 py-2.5 text-sm">
                  Ver Programa Completo
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-20">
          <p className="text-text-muted text-sm">No se encontraron cursos</p>
        </div>
      )}
    </>
  );
}
