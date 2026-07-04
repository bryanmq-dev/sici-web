import Navbar from '@/components/Navbar';
import { getProjects } from '@/lib/actions/projects';
import ProjectsClient from './ProjectsClient';

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen pt-32 pb-20 bg-background font-body">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProjectsClient projects={projects} />
      </div>
    </div>
  );
}
