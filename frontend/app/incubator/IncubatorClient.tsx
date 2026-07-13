'use client';

import React from 'react';
import { motion } from 'motion/react';
import IncubatorProjectCard from '@/components/IncubatorProjectCard';
import { Search } from 'lucide-react';

interface TeamMember {
  id: string;
  userId: string;
  name: string | null;
  role: string;
  finalScore: number | null;
}

interface IncubatorProject {
  id: string;
  title: string;
  description: string;
  content: string | null;
  status: string;
  categories: string[] | null;
  technologies: string[] | null;
  team: TeamMember[];
  client: string | null;
  image: string | null;
  createdAt: Date;
  authorName: string | null;
  authorId: string | null;
}

export default function IncubatorClient({ projects }: { projects: IncubatorProject[] }) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeStatus, setActiveStatus] = React.useState('Todos');

  const statuses = ['Todos', 'Idea', 'Planificación', 'Prototipado', 'En Desarrollo', 'MVP', 'Lanzado'];

  const filteredProjects = projects.filter(project => {
    const matchesStatus = activeStatus === 'Todos' || project.status === activeStatus;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (project.technologies && project.technologies.some((t: string) => t.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesStatus && matchesSearch;
  });

  return (
    <>
      <div className="mb-16 flex flex-col md:flex-row gap-8 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar proyecto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>
        
        <div className="flex flex-wrap gap-2 justify-center">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${
                activeStatus === status 
                  ? 'bg-primary border-primary text-white shadow-[0_0_15px_rgba(211,29,36,0.3)]' 
                  : 'bg-surface-muted border-border text-text-secondary hover:border-primary/50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-32">
        {filteredProjects.map((project, idx) => (
          <IncubatorProjectCard 
            key={project.id} 
            project={{
              id: project.id,
              title: project.title,
              status: project.status as 'Idea' | 'Planificación' | 'Prototipado' | 'En Desarrollo' | 'MVP' | 'Lanzado',
              description: project.description,
              content: project.content || undefined,
              author: project.authorName || undefined,
              authorId: project.authorId || undefined,
              categories: project.categories || [],
              client: project.client || undefined,
              team: project.team.map((m) => ({ userId: m.userId, name: m.name || 'Miembro', role: m.role })),
              image: project.image || '/placeholder-incubator.jpg',
              technologies: project.technologies || [],
            }} 
            index={idx} 
          />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-20">
          <p className="text-text-secondary font-mono text-sm uppercase tracking-widest">
            No se encontraron proyectos
          </p>
        </div>
      )}
    </>
  );
}
