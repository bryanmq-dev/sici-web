import { getProjects } from '@/lib/actions/projects';
import ProjectsClient from './ProjectsClient';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="flex-grow pt-32 pb-20 font-body">
      <div className="container-custom">
        <ProjectsClient projects={projects} />
      </div>
    </main>
  );
}
