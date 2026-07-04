'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { Save, Camera, Github, Linkedin, Twitter, Globe } from 'lucide-react';
import Image from 'next/image';
import { updateUserBio, updateUserSocials, updateUserAvatar } from '@/lib/actions/profile';
import { uploadImage } from '@/lib/actions/uploads';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name: string; avatar: string | null; bio: string | null; socials: Record<string, string> | null };
}

export default function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
  const [bio, setBio] = useState(user.bio || '');
  const [socials, setSocials] = useState({ github: '', linkedin: '', twitter: '', website: '', ...(user.socials || {}) });
  const [avatar, setAvatar] = useState(user.avatar || '/placeholder-avatar.png');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.set('file', file);
      const { url } = await uploadImage(formData);
      await updateUserAvatar(url);
      setAvatar(url);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateUserBio({ bio });
      await updateUserSocials(socials);
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Perfil" subtitle="SICI_ID // PROFILE_UPDATE">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32 cyber-border overflow-hidden group">
            <Image src={avatar} alt="Avatar" fill className="object-cover grayscale group-hover:grayscale-0 transition-all" />
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
          {isUploading && <span className="text-[8px] font-mono text-primary animate-pulse">SUBIENDO...</span>}
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-mono text-primary uppercase tracking-widest">Biografía</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={2000}
            className="w-full bg-black/40 border border-white/10 p-3 text-xs font-mono focus:border-primary/50 outline-none transition-all text-white resize-none"
          />
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-mono text-primary uppercase tracking-widest">Redes_y_Enlaces</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
              <input
                type="text"
                placeholder="GitHub URL"
                value={socials.github}
                onChange={(e) => setSocials({ ...socials, github: e.target.value })}
                className="w-full bg-black/40 border border-white/10 p-3 pl-10 text-[10px] font-mono focus:border-primary/50 outline-none transition-all text-white"
              />
            </div>
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
              <input
                type="text"
                placeholder="LinkedIn URL"
                value={socials.linkedin}
                onChange={(e) => setSocials({ ...socials, linkedin: e.target.value })}
                className="w-full bg-black/40 border border-white/10 p-3 pl-10 text-[10px] font-mono focus:border-primary/50 outline-none transition-all text-white"
              />
            </div>
            <div className="relative">
              <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
              <input
                type="text"
                placeholder="Twitter/X URL"
                value={socials.twitter}
                onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
                className="w-full bg-black/40 border border-white/10 p-3 pl-10 text-[10px] font-mono focus:border-primary/50 outline-none transition-all text-white"
              />
            </div>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40" />
              <input
                type="text"
                placeholder="Sitio web"
                value={socials.website}
                onChange={(e) => setSocials({ ...socials, website: e.target.value })}
                className="w-full bg-black/40 border border-white/10 p-3 pl-10 text-[10px] font-mono focus:border-primary/50 outline-none transition-all text-white"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-white/10">
          <button type="submit" disabled={isSaving} className="hud-button px-12 py-5 flex items-center gap-3 w-full sm:w-auto disabled:opacity-50">
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            <Save className="w-4 h-4" />
          </button>
        </div>
      </form>
    </Modal>
  );
}
