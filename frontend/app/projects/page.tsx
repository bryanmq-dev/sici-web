import Navbar from '@/components/Navbar';
import { getProjects } from '@/lib/actions/projects';
import ProjectsClient from './ProjectsClient';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-[100dvh] pt-32 pb-20 bg-background font-body">
      <Navbar />
      
      <div className="container-custom">
        <ProjectsClient projects={projects} />
      </div>
    </div>
  );
}
