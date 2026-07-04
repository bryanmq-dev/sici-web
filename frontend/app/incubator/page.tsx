import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getIncubatorProjects, getIncubatorTeamMembers } from '@/lib/actions/incubator';
import IncubatorClient from './IncubatorClient';

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
          <div className="text-center mb-24">
            <div>
              <div className="hud-tag mb-4 inline-block">Incubator_Program_v2.4</div>
              <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tighter uppercase">
                Incubadora de <span className="text-primary glow-red">Desarrollo</span>
              </h1>
              <p className="text-secondary max-w-2xl mx-auto font-body text-lg opacity-70">
                Transformando ideas audaces en soluciones tecnológicas escalables. Nuestro ecosistema de incubación proporciona mentoría, recursos y red de contactos.
              </p>
            </div>
          </div>

          <IncubatorClient projects={incubatorProjects} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
