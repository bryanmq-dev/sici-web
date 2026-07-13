"use client";

import React from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import { motion } from "motion/react";

interface Project {
  id: string;
  title: string;
  description: string;
  content: string | null;
  category: string | null;
  tags: string[] | null;
  image: string | null;
  likes: number;
  featured: boolean;
  createdAt: Date;
  authorName: string | null;
  authorId: string | null;
}

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [activeTab, setActiveTab] = React.useState("Todos");
  const [searchTerm, setSearchTerm] = React.useState("");

  const categories = [
    "Todos",
    ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean))),
  ];

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = activeTab === "Todos" || p.category === activeTab;
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.tags &&
        p.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl font-display font-bold mb-4 tracking-tighter uppercase"
          >
            Research <span className="text-primary">Projects</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg max-w-2xl font-body leading-relaxed"
          >
            Explora el ecosistema de innovación desarrollado por nuestros
            miembros. Desde IA hasta Blockchain.
          </motion.p>
        </div>
        <Link
          href="/projects/new"
          className="btn-primary flex items-center gap-2 shrink-0 px-6 py-2.5"
        >
          <Plus className="w-4 h-4" /> Postular Proyecto
        </Link>
      </div>

      <div className="flex flex-col gap-4 items-end mb-8">
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
        <div className="flex flex-wrap gap-2 justify-end">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat || "Todos")}
              className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${
                activeTab === cat
                  ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(211,29,36,0.3)]"
                  : "bg-surface-muted border-border text-text-secondary hover:border-primary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <ProjectCard
              project={{
                id: project.id,
                title: project.title,
                description: project.description,
                content: project.content || "",
                tags: project.tags || [],
                date: project.createdAt.toISOString().split("T")[0],
                likes: project.likes,
                image: project.image || "/placeholder-project.jpg",
                category: project.category || "General",
                author: project.authorName || "Unknown",
                authorId: project.authorId || "",
              }}
            />
          </motion.div>
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
