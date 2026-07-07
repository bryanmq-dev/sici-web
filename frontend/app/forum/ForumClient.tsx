"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "motion/react";
import QuestionModal from "@/components/QuestionModal";
import ForumQuestionCard from "@/components/ForumQuestionCard";
import { Search, Clock, TrendingUp, Eye, Plus } from "lucide-react";

interface ForumQuestion {
  id: string;
  title: string;
  description: string;
  tags: string[] | null;
  views: number;
  likes: number;
  isSolved: boolean;
  featuredAnswerId: string | null;
  createdAt: Date;
  authorName: string | null;
  authorId: string | null;
}

export default function ForumClient({
  questions,
}: {
  questions: ForumQuestion[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("newest");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { status: sessionStatus } = useSession();
  const router = useRouter();

  const handleAskQuestion = () => {
    if (sessionStatus !== "authenticated") {
      router.push("/login");
      return;
    }
    setIsModalOpen(true);
  };

  const filteredQuestions = questions.filter(
    (q) =>
      q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.tags &&
        q.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))),
  );

  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (activeTab === "newest")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (activeTab === "votes") return b.likes - a.likes;
    if (activeTab === "views") return b.views - a.views;
    return 0;
  });

  const allTags = Array.from(new Set(questions.flatMap((q) => q.tags || [])));

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-text-primary mb-2"
          >
            Foro de Consultas
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary max-w-xl"
          >
            Plataforma de intercambio de conocimiento técnico y resolución de
            problemas para la comunidad SICI.
          </motion.p>
        </div>

        <button
          onClick={handleAskQuestion}
          className="btn-primary shrink-0 flex items-center p-2 gap-2 rounded-sm"
        >
          Hacer una Pregunta
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <QuestionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0 space-y-8 order-2 lg:order-1">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-text-primary">
              Búsqueda rápida
            </h4>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Filtrar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-text-primary">
              Etiquetas populares
            </h4>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchTerm(tag)}
                  className="badge-secondary hover:border-primary/50 hover:text-primary transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h4 className="text-sm font-medium text-text-primary mb-3">
              Estado de la comunidad
            </h4>
            <div className="flex justify-between items-center">
              <span className="text-sm text-text-secondary">
                Consultas totales
              </span>
              <span className="text-sm font-semibold text-text-primary">
                {questions.length}
              </span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-grow order-1 lg:order-2 space-y-6">
          {/* Sorting Tabs */}
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex gap-6">
              {[
                { id: "newest", label: "Recientes", icon: Clock },
                { id: "votes", label: "Más Votados", icon: TrendingUp },
                { id: "views", label: "Populares", icon: Eye },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-primary"
                      : "text-text-muted hover:text-text-secondary"
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="text-xs text-text-muted">
              {sortedQuestions.length} resultado
              {sortedQuestions.length === 1 ? "" : "s"}
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {sortedQuestions.map((question, idx) => (
              <ForumQuestionCard
                key={question.id}
                question={question}
                index={idx}
              />
            ))}
          </div>

          {sortedQuestions.length === 0 && (
            <div className="text-center py-20">
              <p className="text-text-muted text-sm">
                No hay preguntas en el foro
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
