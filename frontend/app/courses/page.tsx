import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCourses } from '@/lib/actions/courses';
import CoursesClient from './CoursesClient';

export const dynamic = 'force-dynamic';

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <div>
              <div className="hud-tag mb-4 inline-block">Learning_Platform_v1.8</div>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tighter uppercase">
                Cursos de <span className="text-primary glow-red">Especialización</span>
              </h1>
              <p className="text-secondary max-w-2xl mx-auto font-body text-lg opacity-70">
                Aprende las tecnologías más demandadas del mercado con un enfoque práctico y orientado a proyectos de investigación.
              </p>
            </div>
          </div>

          <CoursesClient courses={courses} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
