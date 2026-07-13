"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Globe,
  AlertCircle,
} from "lucide-react";
import { createContactMessage } from "@/lib/actions/notifications";
import { getErrorMessage } from "@/lib/utils";

export default function ContactPage() {
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success">(
    "idle",
  );
  const [error, setError] = React.useState("");
  const reduceMotion = useReducedMotion();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await createContactMessage({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        subject: (formData.get("subject") as string) || undefined,
        message: formData.get("message") as string,
      });
      setStatus("success");
    } catch (err) {
      setError(getErrorMessage(err));
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4 pt-32 pb-20">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full card p-10 text-center"
          >
            <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-text-primary mb-2">
              Mensaje Enviado
            </h1>
            <p className="text-sm text-text-secondary mb-8">
              Tu mensaje fue enviado a la SICI. Te responderemos a la brevedad
              posible.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="btn-secondary w-full py-3"
            >
              Volver al Inicio
            </button>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-bold text-text-primary mb-4"
            >
              Establecer Contacto
            </motion.h1>
            <motion.p
              initial={reduceMotion ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-text-secondary max-w-2xl mx-auto"
            >
              ¿Tienes alguna duda, propuesta o quieres colaborar? Estamos a un
              mensaje de distancia.
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
              <div className="card p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary/5 rounded-lg shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-text-muted">
                      Email oficial
                    </h3>
                    <p className="text-sm text-text-primary">
                      contacto@soceisi.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center bg-primary/5 rounded-lg shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-text-muted">
                      Línea directa
                    </h3>
                    <p className="text-sm text-text-primary">+591 76741337</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-sm font-medium text-text-primary mb-4">
                  Redes sociales
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    <Globe className="w-4 h-4" /> LinkedIn
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    <Globe className="w-4 h-4" /> Instagram
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    <Globe className="w-4 h-4" /> Facebook
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    <Globe className="w-4 h-4" /> Twitter
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 card p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary block">
                      Nombre completo
                    </label>
                    <input
                      required
                      name="name"
                      type="text"
                      placeholder="Ej. Alejandro Chipana"
                      className="input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-primary block">
                      Email de contacto
                    </label>
                    <input
                      required
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      className="input"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary block">
                    Asunto
                  </label>
                  <input
                    name="subject"
                    type="text"
                    placeholder="Motivo de tu consulta..."
                    className="input"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-primary block">
                    Mensaje
                  </label>
                  <textarea
                    required
                    name="message"
                    rows={6}
                    placeholder="Escribe tu mensaje aquí..."
                    className="textarea"
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-primary px-8 py-3 text-sm flex items-center gap-2"
                >
                  {status === "submitting" ? (
                    "Enviando..."
                  ) : (
                    <>
                      Enviar Mensaje
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
