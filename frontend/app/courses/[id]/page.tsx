import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCourseById, isEnrolledInCourse } from '@/lib/actions/courses';
import CourseDetailClient from './CourseDetailClient';
import { notFound } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await getCourseById(id);

  if (!course) notFound();

  const session = await auth();
  const isEnrolled = session?.user ? await isEnrolledInCourse(id, session.user.id) : false;

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <CourseDetailClient course={course} isEnrolled={isEnrolled} isAuthenticated={!!session?.user} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
