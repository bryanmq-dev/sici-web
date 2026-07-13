import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedPageHeader from '@/components/AnimatedPageHeader';
import { getCourses } from '@/lib/actions/courses';
import CoursesClient from './CoursesClient';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedPageHeader
            title={<>Cursos de <span className="text-primary">Especialización</span></>}
            description="Aprende las tecnologías más demandadas del mercado con un enfoque práctico y orientado a proyectos de investigación."
          />

          <CoursesClient courses={courses} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
