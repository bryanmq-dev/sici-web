"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Clock,
  CheckCircle2,
  X,
  MessageSquare,
  User,
  ArrowRight,
  Upload,
  AlertCircle,
} from "lucide-react";
import { createMentorship } from "@/lib/actions/mentorship";
import { uploadMentorshipSyllabus } from "@/lib/actions/uploads";
import { getErrorMessage } from "@/lib/utils";

interface MentorshipRequest {
  id: string;
  topic: string;
  description: string;
  status: string;
  kind: string;
  createdAt: Date;
  studentName: string | null;
  studentId: string | null;
  mentorId: string | null;
}

interface Mentor {
  id: string;
  specialty: string;
  userName: string | null;
}

const statusBadge: Record<string, string> = {
  pending: "badge-warning",
  accepted: "badge-primary",
  completed: "badge-success",
};

export default function MentorshipClient({
  requests,
  mentors,
}: {
  requests: MentorshipRequest[];
  mentors: Mentor[];
}) {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [modalKind, setModalKind] = useState<"request" | "open">("request");
  const [newRequest, setNewRequest] = useState({
    topic: "",
    description: "",
    categories: "",
  });
  const [syllabusFile, setSyllabusFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const openModal = (kind: "request" | "open") => {
    setModalKind(kind);
    setError("");
    setShowRequestModal(true);
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      let syllabusUrl: string | undefined;
      if (modalKind === "open" && syllabusFile) {
        const formData = new FormData();
        formData.set("file", syllabusFile);
        const result = await uploadMentorshipSyllabus(formData);
        syllabusUrl = result.url;
      }

      await createMentorship({
        topic: newRequest.topic,
        description: newRequest.description,
        kind: modalKind,
        syllabusUrl,
        categories: newRequest.categories
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });

      setShowRequestModal(false);
      setNewRequest({ topic: "", description: "", categories: "" });
      setSyllabusFile(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-text-primary mb-2"
          >
            Hub de Mentorías
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-text-secondary max-w-2xl"
          >
            Solicita orientación técnica o científica por tema. Nuestra red de
            mentores (docentes e investigadores senior) revisará tu solicitud
            para guiarte en tu camino.
          </motion.p>
        </div>

        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => openModal("request")}
            className="btn-primary rounded-sm flex items-center p-2"
          >
            <Plus className="w-4 h-4" /> Solicitar Mentoría
          </button>
          <button
            onClick={() => openModal("open")}
            className="btn-secondary rounded-sm flex items-center p-2"
          >
            <Plus className="w-4 h-4" /> Abrir Mentoría
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          {
            label: "Solicitudes totales",
            value: requests.length,
            icon: MessageSquare,
          },
          {
            label: "En curso",
            value: requests.filter((r) => r.status === "accepted").length,
            icon: Clock,
          },
          {
            label: "Completadas",
            value: requests.filter((r) => r.status === "completed").length,
            icon: CheckCircle2,
          },
          { label: "Mentores activos", value: mentors.length, icon: User },
        ].map((stat, i) => (
          <div key={i} className="card p-6 flex items-center gap-4">
            <div className="p-3 bg-primary/5 rounded-lg">
              <stat.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-xs text-text-muted">{stat.label}</div>
              <div className="text-2xl font-bold text-text-primary">
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Requests Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {requests.map((request) => (
          <motion.div
            key={request.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`badge ${statusBadge[request.status] || "badge-secondary"}`}
              >
                {request.status}
              </span>
              <span className="badge-secondary">
                {request.kind === "open"
                  ? "Mentoría abierta"
                  : "Solicitud de ayuda"}
              </span>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">
                {request.topic}
              </h3>

              <p className="text-sm text-text-secondary line-clamp-3">
                {request.description}
              </p>

              <div className="pt-4 border-t border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center">
                  <User className="w-4 h-4 text-text-muted" />
                </div>
                <div>
                  <div className="text-xs text-text-muted">Solicitado por</div>
                  <div className="text-sm font-medium text-text-primary">
                    {request.studentName || "Anónimo"}
                  </div>
                </div>
              </div>

              <Link
                href={`/mentorship/${request.id}`}
                className="btn-secondary w-full py-2 text-sm"
              >
                Ver Detalles <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {requests.length === 0 && (
        <div className="text-center py-20">
          <p className="text-text-muted text-sm">
            No hay solicitudes de mentoría
          </p>
        </div>
      )}

      {/* Request Modal */}
      <AnimatePresence>
        {showRequestModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRequestModal(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl card p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-semibold text-text-primary">
                  {modalKind === "open"
                    ? "Abrir Mentoría"
                    : "Solicitar Mentoría"}
                </h2>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="text-text-muted hover:text-text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitRequest} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary block">
                    Tema principal
                  </label>
                  <input
                    type="text"
                    required
                    value={newRequest.topic}
                    onChange={(e) =>
                      setNewRequest({ ...newRequest, topic: e.target.value })
                    }
                    className="input"
                    placeholder="Ej. Inteligencia artificial en edge computing"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary block">
                    Descripción del problema
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newRequest.description}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        description: e.target.value,
                      })
                    }
                    className="textarea"
                    placeholder="Describe en qué necesitas ayuda..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary block">
                    Categorías (separadas por coma)
                  </label>
                  <input
                    type="text"
                    value={newRequest.categories}
                    onChange={(e) =>
                      setNewRequest({
                        ...newRequest,
                        categories: e.target.value,
                      })
                    }
                    className="input"
                    placeholder="Ej. IA, Python, Optimización"
                  />
                  <p className="text-xs text-text-muted">
                    Si la categoría no existe, se crea automáticamente.
                  </p>
                </div>

                {modalKind === "open" && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5" /> Temario PDF (requerido)
                    </label>
                    <input
                      type="file"
                      accept="application/pdf"
                      required
                      onChange={(e) =>
                        setSyllabusFile(e.target.files?.[0] || null)
                      }
                      className="input"
                    />
                  </div>
                )}

                {error && (
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRequestModal(false)}
                    className="btn-secondary flex-1 py-3"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex-1 py-3"
                  >
                    {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
