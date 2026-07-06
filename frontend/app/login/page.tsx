"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Shield, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect } from "react";
import { INSTITUTIONAL_EMAIL_DOMAIN } from "@/lib/constants/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      if (result.code === "pending_review") {
        setError(
          "Tu solicitud de ingreso está en revisión. Te avisaremos por correo cuando sea aprobada.",
        );
      } else if (result.code === "account_rejected") {
        setError(
          "Tu solicitud de ingreso fue rechazada. Revisa tu correo para más detalles.",
        );
      } else {
        setError(
          "Credenciales inválidas. Por favor, verifica tu email y contraseña.",
        );
      }
      setIsLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-muted text-sm">Verificando sesión...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="card p-8">
            <div className="mb-8 text-center">
              <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-2xl font-semibold text-text-primary mb-2">
                Iniciar Sesión
              </h1>
              <p className="text-sm text-text-secondary">
                Ingresa tus credenciales para acceder a tu cuenta
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary block">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-10"
                    placeholder={`tu.usuario@${INSTITUTIONAL_EMAIL_DOMAIN}`}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary block">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-10"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
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
                disabled={isLoading}
                className="btn-primary content-center flex items-center p-2 gap-2 rounded-sm m-auto"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Iniciar Sesión
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-text-muted">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/join"
                  className="text-primary hover:text-primary-hover font-medium transition-colors"
                >
                  Regístrate
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
