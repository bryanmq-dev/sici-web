import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedPageHeader from '@/components/AnimatedPageHeader';
import { getIncubatorProjects, getIncubatorTeamMembers } from '@/lib/actions/incubator';
import IncubatorClient from './IncubatorClient';

export const dynamic = 'force-dynamic';

export default async function IncubatorPage() {
  const projects = await getIncubatorProjects();
  const incubatorProjects = await Promise.all(
    projects.map(async (p) => ({ ...p, team: await getIncubatorTeamMembers(p.id) }))
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedPageHeader
            title={<>Incubadora de <span className="text-primary glow-red">Desarrollo</span></>}
            description="Transformando ideas audaces en soluciones tecnológicas escalables. Nuestro ecosistema de incubación proporciona mentoría, recursos y red de contactos."
          />

          <IncubatorClient projects={incubatorProjects} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
