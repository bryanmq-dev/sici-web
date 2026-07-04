import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCourseById } from '@/lib/actions/courses';
import CourseDetailClient from './CourseDetailClient';
import { notFound } from 'next/navigation';

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourseById(id);
  
  if (!course) notFound();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <CourseDetailClient course={course} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
