"use client";

import React from "react";
import { motion } from "motion/react";
import { Search, User, Calendar, Download, Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Article {
  id: string;
  title: string;
  abstract: string;
  content: string | null;
  researchArea: string | null;
  authorIds: string[] | null;
  pdfUrl: string | null;
  image: string | null;
  likes: number;
  createdAt: Date;
}

export default function ArticlesClient({ articles }: { articles: Article[] }) {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeArea, setActiveArea] = React.useState("Todos");

  const researchAreas = [
    "Todos",
    ...Array.from(new Set(articles.map((a) => a.researchArea).filter(Boolean))),
  ];

  const filteredArticles = articles.filter((article) => {
    const matchesArea =
      activeArea === "Todos" || article.researchArea === activeArea;
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (article.researchArea &&
        article.researchArea.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesArea && matchesSearch;
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
            Research <span className="text-primary">Articles</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary text-lg max-w-2xl font-body leading-relaxed"
          >
            Publicaciones científicas desarrolladas por nuestros miembros. Desde IA hasta Blockchain.
          </motion.p>
        </div>
        <Link
          href="/articles/new"
          className="btn-primary flex items-center gap-2 shrink-0 px-6 py-2.5"
        >
          <Plus className="w-4 h-4" /> Publicar Artículo
        </Link>
      </div>

      <div className="flex flex-col gap-4 items-end mb-8">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Buscar investigación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          {researchAreas.map((area) => (
            <button
              key={area}
              onClick={() => setActiveArea(area || "Todos")}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                activeArea === area
                  ? "bg-primary text-white"
                  : "bg-surface-muted text-text-secondary border border-border hover:bg-surface-hover"
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        <p className="text-xs text-text-muted">
          {filteredArticles.length} resultado
          {filteredArticles.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map((article, idx) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card overflow-hidden group flex flex-col"
          >
            <div className="aspect-video relative overflow-hidden bg-surface-muted">
              <Image
                src={article.image || "/placeholder-article.jpg"}
                alt={article.title}
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              {article.researchArea && (
                <div className="absolute bottom-4 left-4">
                  <span className="badge-secondary text-[11px]">
                    {article.researchArea}
                  </span>
                </div>
              )}
            </div>

            <div className="p-5 flex-grow flex flex-col">
              <h2 className="text-lg font-semibold group-hover:text-primary transition-colors leading-snug mb-2 line-clamp-2">
                {article.title}
              </h2>

              <p className="text-sm text-text-secondary line-clamp-3 mb-4 flex-grow">
                {article.abstract}
              </p>

              <div className="flex items-center justify-between text-xs text-text-muted pt-4 border-t border-border mb-4">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />{" "}
                  {article.authorIds?.length || 0} autor
                  {article.authorIds?.length === 1 ? "" : "es"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />{" "}
                  {article.createdAt.toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/articles/${article.id}`}
                  className="btn-primary flex items-center justify-center gap-2 flex-1 py-2.5 text-sm"
                >
                  Ver Detalles
                </Link>
                {article.pdfUrl && (
                  <a
                    href={article.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center justify-center gap-2 px-6 py-2.5"
                    title="Descargar PDF"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-20">
          <p className="text-text-muted text-sm">No se encontraron artículos</p>
        </div>
      )}
    </>
  );
}
