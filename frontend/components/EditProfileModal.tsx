'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { Save, Camera, Github, Linkedin, Twitter, Globe, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { updateUserBio, updateUserSocials, updateUserAvatar } from '@/lib/actions/profile';
import { uploadImage } from '@/lib/actions/uploads';
import { getErrorMessage } from '@/lib/utils';

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
  const [error, setError] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.set('file', file);
      const { url } = await uploadImage(formData);
      await updateUserAvatar(url);
      setAvatar(url);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      await updateUserBio({ bio });
      await updateUserSocials(socials);
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Perfil" subtitle="Actualiza tu información pública">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-28 h-28 rounded-full overflow-hidden group border border-border">
            <Image src={avatar} alt="Avatar" fill className="object-cover" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Camera className="w-5 h-5 text-white mb-1" />
              <span className="text-xs text-white">Cambiar foto</span>
            </button>
          </div>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
          {isUploading && <span className="text-xs text-text-muted animate-pulse">Subiendo...</span>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary block">Biografía</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={2000}
            className="textarea"
          />
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-text-primary">Redes y enlaces</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="GitHub URL"
                value={socials.github}
                onChange={(e) => setSocials({ ...socials, github: e.target.value })}
                className="input pl-10"
              />
            </div>
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="LinkedIn URL"
                value={socials.linkedin}
                onChange={(e) => setSocials({ ...socials, linkedin: e.target.value })}
                className="input pl-10"
              />
            </div>
            <div className="relative">
              <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Twitter/X URL"
                value={socials.twitter}
                onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
                className="input pl-10"
              />
            </div>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Sitio web"
                value={socials.website}
                onChange={(e) => setSocials({ ...socials, website: e.target.value })}
                className="input pl-10"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-lg">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <button type="button" onClick={onClose} className="btn-secondary py-3">
            Cancelar
          </button>
          <button type="submit" disabled={isSaving} className="btn-primary py-3">
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            <Save className="w-4 h-4" />
          </button>
        </div>
      </form>
    </Modal>
  );
}
