'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Shield, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

import { useEffect } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (login(username, password)) {
      router.push('/dashboard');
    } else {
      setError('CREDENCIALES_INVALIDAS // ACCESO_DENEGADO');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center px-4 pt-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="glass p-8 cyber-border relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Shield className="w-32 h-32" />
            </div>

            <div className="mb-8 space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-mono text-primary uppercase tracking-[0.3em]">
                <Lock className="w-3 h-3" /> SECURITY_GATE_V2.0
              </div>
              <h1 className="text-4xl font-display font-bold uppercase tracking-tighter text-on-surface">
                Acceso <span className="text-primary glow-red">Restringido</span>
              </h1>
              <p className="text-secondary/60 font-mono text-[10px] uppercase tracking-widest">
                Ingrese credenciales para autorizar sesión en la terminal.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-primary uppercase tracking-widest block">
                    Usuario_ID
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 p-4 pl-12 text-sm font-mono focus:border-primary/50 outline-none transition-all text-white uppercase"
                      placeholder="ID_USUARIO"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-primary uppercase tracking-widest block">
                    Clave_Acceso
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 p-4 pl-12 text-sm font-mono focus:border-primary/50 outline-none transition-all text-white uppercase"
                      placeholder="********"
                      required
                    />
                  </div>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/30 text-primary text-[10px] font-mono uppercase tracking-widest"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="hud-button w-full py-4 flex items-center justify-center gap-3 group"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    INICIAR_SESIÓN
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
              <div className="text-[8px] font-mono text-secondary/30 uppercase tracking-widest">
                Auth_Status: WAITING
              </div>
              <div className="text-[8px] font-mono text-secondary/30 uppercase tracking-widest">
                Node: SICI_CORE_01
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
