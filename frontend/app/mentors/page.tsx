import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MentorCard from '@/components/MentorCard';
import { getMentors } from '@/lib/actions/mentors';

export const dynamic = 'force-dynamic';

export default async function MentorsPage() {
  const mentors = await getMentors();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <div>
              <div className="hud-tag mb-4 inline-block">Mentorship_Program_v1.5</div>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tighter uppercase">
                Red de <span className="text-primary glow-red">Mentores</span>
              </h1>
              <p className="text-secondary max-w-2xl mx-auto font-body text-lg opacity-70">
                Aprende de los mejores. Nuestra red de mentores incluye docentes expertos y estudiantes destacados con experiencia real en la industria.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
            {mentors.map((mentor, idx) => (
              <MentorCard 
                key={mentor.id} 
                mentor={{
                  id: mentor.id,
                  name: mentor.userName || 'Sin nombre',
                  photo: mentor.userAvatar || '/placeholder-mentor.jpg',
                  specialty: mentor.specialty,
                  experience: mentor.experience || '',
                  type: mentor.mentorType as 'docente' | 'estudiante',
                  courseIds: [],
                  skills: (mentor.skills as Array<{name: string; level: number}>) || [],
                }} 
                index={idx} 
              />
            ))}
          </div>

          {mentors.length === 0 && (
            <div className="text-center py-20">
              <p className="text-secondary font-mono text-sm uppercase tracking-widest">
                No hay mentores registrados
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
