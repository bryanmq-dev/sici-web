import MentorCard from '@/components/MentorCard';
import AnimatedPageHeader from '@/components/AnimatedPageHeader';
import { getMentors } from '@/lib/actions/mentors';

export const dynamic = 'force-dynamic';

export default async function MentorsPage() {
  const mentors = await getMentors();

  return (
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedPageHeader
            title={<>Red de <span className="text-primary">Mentores</span></>}
            description="Aprende de los mejores. Nuestra red de mentores incluye docentes expertos y estudiantes destacados con experiencia real en la industria."
          />

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
              <p className="text-text-secondary font-mono text-sm uppercase tracking-widest">
                No hay mentores registrados
              </p>
            </div>
          )}
        </div>
      </main>
  );
}
