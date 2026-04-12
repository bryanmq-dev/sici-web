'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { Save, User, Camera, Github, Linkedin, Twitter, Globe, Plus, X } from 'lucide-react';
import Image from 'next/image';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export default function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    role: user.role,
    bio: user.bio,
    avatar: user.avatar,
    socials: { ...user.socials }
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save profile would go here
    console.log('Saving profile:', formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Perfil"
      subtitle="SICI_ID // PROFILE_UPDATE"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Avatar Upload */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32 cyber-border overflow-hidden group">
            <Image src={formData.avatar} alt="Avatar" fill className="object-cover grayscale group-hover:grayscale-0 transition-all" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="w-6 h-6 text-primary mb-1" />
              <span className="text-[8px] font-mono text-primary uppercase">Cambiar_Foto</span>
            </button>
          </div>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
          {isUploading && <span className="text-[8px] font-mono text-primary animate-pulse">PROCESANDO_IMAGEN...</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-primary uppercase tracking-widest">Nombre_Completo</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-black/40 border border-white/10 p-3 text-xs font-mono focus:border-primary/50 outline-none transition-all text-white uppercase"
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-primary uppercase tracking-widest">Cargo_Actual</label>
            <input
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-black/40 border border-white/10 p-3 text-xs font-mono focus:border-primary/50 outline-none transition-all text-white uppercase"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-primary uppercase tracking-widest">Biografía_Técnica</label>
          <textarea
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full bg-black/40 border border-white/10 p-3 text-xs font-mono focus:border-primary/50 outline-none transition-all text-white uppercase resize-none"
          />
        </div>

        {/* Socials */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-mono text-primary uppercase tracking-widest">Redes_y_Enlaces</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
              <input
                type="text"
                placeholder="GitHub URL"
                value={formData.socials.github || ''}
                onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, github: e.target.value } })}
                className="w-full bg-black/40 border border-white/10 p-3 pl-10 text-[10px] font-mono focus:border-primary/50 outline-none transition-all text-white"
              />
            </div>
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
              <input
                type="text"
                placeholder="LinkedIn URL"
                value={formData.socials.linkedin || ''}
                onChange={(e) => setFormData({ ...formData, socials: { ...formData.socials, linkedin: e.target.value } })}
                className="w-full bg-black/40 border border-white/10 p-3 pl-10 text-[10px] font-mono focus:border-primary/50 outline-none transition-all text-white"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-6 border-t border-white/10">
          <button type="submit" className="hud-button px-12 py-5 flex items-center gap-3 w-full sm:w-auto">
            Guardar Cambios
            <Save className="w-4 h-4" />
          </button>
        </div>
      </form>
    </Modal>
  );
}
