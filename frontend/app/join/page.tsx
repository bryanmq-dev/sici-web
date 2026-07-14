"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  BookOpen,
  Code,
  Send,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { createRegistration } from "@/lib/actions/notifications";
import { INSTITUTIONAL_EMAIL_DOMAIN } from "@/lib/constants/auth";
import { getErrorMessage } from "@/lib/utils";

export default function JoinPage() {
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [error, setError] = React.useState("");
  const reduceMotion = useReducedMotion();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const password = String(formData.get("password") || "");
    const passwordConfirm = String(formData.get("passwordConfirm") || "");

    if (password !== passwordConfirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setStatus("submitting");
    try {
      await createRegistration({
        fullName: String(formData.get("fullName") || ""),
        email: String(formData.get("email") || ""),
        password,
        semester: Number(formData.get("semester")),
        interestArea: String(formData.get("interestArea") || ""),
        motivation: String(formData.get("motivation") || ""),
      });
      setStatus("success");
    } catch (err) {
      setError(getErrorMessage(err));
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <main className="flex-grow flex items-center justify-center p-4 pt-32 pb-20">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full card p-10 text-center"
        >
          <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-text-primary mb-2">
            Solicitud recibida
          </h1>
          <p className="text-sm text-text-secondary mb-8">
            Un administrador revisará tu solicitud. Te avisaremos por correo
            institucional cuando sea aprobada.
          </p>
          <Link href="/" className="btn-secondary w-full py-3">
            Volver al inicio
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="flex-grow flex items-center justify-center px-4 pt-32 pb-20">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
          <div className="card p-8">
            <div className="mb-8 text-center">
              <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-semibold text-text-primary mb-2">
                Únete a la SICI
              </h1>
              <p className="text-sm text-text-secondary">
                Completa tu perfil para iniciar el proceso de selección
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary block">
                  Nombre completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    name="fullName"
                    type="text"
                    required
                    className="input pl-10"
                    placeholder="Ej. Alejandro Chipana"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary block">
                  Email institucional
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    name="email"
                    type="email"
                    required
                    className="input pl-10"
                    placeholder={`tu.usuario@${INSTITUTIONAL_EMAIL_DOMAIN}`}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary block">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      name="password"
                      type="password"
                      required
                      minLength={8}
                      className="input pl-10"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary block">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      name="passwordConfirm"
                      type="password"
                      required
                      minLength={8}
                      className="input pl-10"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary block">
                    Semestre actual
                  </label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <select
                      name="semester"
                      className="input pl-10"
                      defaultValue="1"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((s) => (
                        <option key={s} value={s}>
                          {s}° semestre
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary block">
                    Área de interés
                  </label>
                  <div className="relative">
                    <Code className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <select
                      name="interestArea"
                      className="input pl-10"
                      defaultValue="Inteligencia Artificial"
                    >
                      <option>Inteligencia Artificial</option>
                      <option>Ciberseguridad</option>
                      <option>Blockchain / Web3</option>
                      <option>IoT / Robótica</option>
                      <option>Desarrollo Fullstack</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary block">
                  ¿Por qué quieres unirte a la SICI?
                </label>
                <textarea
                  name="motivation"
                  required
                  rows={4}
                  className="textarea"
                  placeholder="Cuéntanos tus motivaciones y experiencia previa..."
                />
              </div>

              {error && (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {error}
                  </p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
              >
                {status === "submitting" ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Enviar solicitud
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-text-muted">
                ¿Ya tienes cuenta?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:text-primary-hover font-medium transition-colors inline-flex items-center gap-1"
                >
                  Inicia sesión <ArrowRight className="w-3 h-3" />
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
    </main>
  );
}
