"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Markdown from "react-markdown";
import { Send, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import { createArticle } from "@/lib/actions/articles";
import { getErrorMessage } from "@/lib/utils";
import { useRequireAuth } from "@/hooks/use-require-auth";

const VIEWS = [
  { id: "edit", label: "Editor" },
  { id: "split", label: "Dividido" },
  { id: "preview", label: "Vista previa" },
] as const;

export default function NewArticlePage() {
  const router = useRouter();
  const { isReady, isLoading } = useRequireAuth();
  const [title, setTitle] = useState("");
  const [researchArea, setResearchArea] = useState("");
  const [abstract, setAbstract] = useState("");
  const [content, setContent] = useState(
    "# Título del Artículo\n\nEscribe aquí tu investigación usando **Markdown**.\n\n## Introducción\n...",
  );
  const [view, setView] = useState<"edit" | "preview" | "split">("split");
  const [execSummary, setExecSummary] = useState({
    introduccion: "",
    metodologia: "",
    resultados: "",
    conclusion: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handlePublish = async () => {
    if (!title || !abstract) return;
    setIsSubmitting(true);
    setError("");
    try {
      await createArticle({
        title,
        researchArea,
        abstract,
        content,
        execSummary,
      });
      router.push("/articles");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-muted text-sm">Verificando sesión...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-[1600px] mx-auto">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a Artículos
          </Link>

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Redactar Artículo
              </h1>
              <p className="text-text-secondary text-sm">
                Tu artículo quedará pendiente de aprobación del administrador
                antes de ser público.
              </p>
            </div>

            <div className="flex gap-3 items-center">
              <div className="flex gap-2">
                {VIEWS.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setView(v.id)}
                    className={`px-3 py-2 rounded-sm text-xs font-medium transition-colors ${
                      view === v.id
                        ? "bg-primary text-white"
                        : "bg-surface-muted text-text-secondary border border-border hover:bg-surface-hover"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
              <button
                onClick={handlePublish}
                disabled={isSubmitting || !title || !abstract}
                className="btn-primary shrink-0 flex items-center gap-2 rounded-sm p-2"
              >
                <Send className="w-4 h-4" />{" "}
                {isSubmitting ? "Enviando..." : "Publicar Investigación"}
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Metadata Fields */}
          <div className="grid md:grid-cols-3 gap-5 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary block">
                Título del artículo
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                placeholder="Ej. Impacto de la IA en la ciberseguridad"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary block">
                Área de investigación
              </label>
              <select
                value={researchArea}
                onChange={(e) => setResearchArea(e.target.value)}
                className="input"
              >
                <option value="">Seleccionar área</option>
                <option value="Ciberseguridad">Ciberseguridad</option>
                <option value="IA">Inteligencia Artificial</option>
                <option value="Blockchain">Blockchain</option>
                <option value="IoT">IoT</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary block">
                Resumen (Abstract)
              </label>
              <input
                type="text"
                value={abstract}
                onChange={(e) => setAbstract(e.target.value)}
                className="input"
                placeholder="Breve descripción de la investigación"
              />
            </div>
          </div>

          {/* Resumen Ejecutivo */}
          <div className="grid md:grid-cols-2 gap-5 mb-6">
            {(
              [
                ["introduccion", "Introducción"],
                ["metodologia", "Metodología"],
                ["resultados", "Resultados"],
                ["conclusion", "Conclusión"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="space-y-2">
                <label className="text-sm font-medium text-text-primary block">
                  {label}
                </label>
                <textarea
                  value={execSummary[key]}
                  onChange={(e) =>
                    setExecSummary((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                  rows={3}
                  className="textarea"
                  placeholder={`${label} de la investigación`}
                />
              </div>
            ))}
          </div>

          {/* Editor/Preview Area */}
          <div
            className={`grid gap-6 ${view === "split" ? "lg:grid-cols-2" : "grid-cols-1"}`}
          >
            {/* Editor */}
            {(view === "edit" || view === "split") && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card flex flex-col h-[600px] overflow-hidden"
              >
                <div className="p-3 border-b border-border bg-surface-muted">
                  <span className="text-xs font-medium text-text-muted">
                    Código fuente (Markdown)
                  </span>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="flex-grow bg-transparent p-6 text-sm font-mono text-text-secondary focus:outline-none resize-none leading-relaxed"
                  spellCheck={false}
                />
              </motion.div>
            )}

            {/* Preview */}
            {(view === "preview" || view === "split") && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="card flex flex-col h-[600px] overflow-hidden"
              >
                <div className="p-3 border-b border-border bg-surface-muted">
                  <span className="text-xs font-medium text-text-muted">
                    Vista previa renderizada
                  </span>
                </div>
                <div className="flex-grow overflow-y-auto p-6 md:p-8 prose prose-invert max-w-none">
                  <Markdown>{content}</Markdown>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
