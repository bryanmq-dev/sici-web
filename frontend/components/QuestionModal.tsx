"use client";

import React, { useState } from "react";
import Modal from "./Modal";
import { Send, X, AlertCircle } from "lucide-react";
import { createForumQuestion } from "@/lib/actions/forum";
import { getErrorMessage } from "@/lib/utils";

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuestionModal({ isOpen, onClose }: QuestionModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      await createForumQuestion({ title, description, tags });
      setTitle("");
      setDescription("");
      setTags([]);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hacer una Pregunta"
      subtitle="Consulta técnica para la comunidad SICI"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary block">
            Título de la consulta
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej. Error de segmentación en kernel v5.10..."
            className="input"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary block">
            Descripción técnica
          </label>
          <textarea
            required
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe el problema, el contexto y lo que has intentado..."
            className="textarea"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary block">
            Etiquetas (presiona Enter)
          </label>
          <div className="input h-auto min-h-[3rem] flex flex-wrap gap-2 items-center py-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="badge-secondary flex items-center gap-1"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-text-primary"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={addTag}
              placeholder={
                tags.length === 0 ? "Ej. kernel, c++, seguridad" : ""
              }
              className="flex-grow bg-transparent border-none outline-none text-sm text-text-primary min-w-[100px]"
            />
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex items-center p-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center px-6 py-2.5 gap-2"
          >
            {isSubmitting ? "Publicando..." : "Publicar Consulta"}
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </Modal>
  );
}
