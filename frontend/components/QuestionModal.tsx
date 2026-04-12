'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import { Send, ShieldCheck, Camera, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuestionModal({ isOpen, onClose }: QuestionModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages([...images, reader.result as string]);
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim().toUpperCase())) {
        setTags([...tags, newTag.trim().toUpperCase()]);
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const removeImage = (imgToRemove: string) => {
    setImages(images.filter(img => img !== imgToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to save the question would go here
    console.log({ title, description, tags, images });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Hacer una Pregunta"
      subtitle="Consulta técnica para la red SICI"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-primary uppercase tracking-widest">Título_de_la_Consulta</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Error de segmentación en kernel v5.10..."
            className="w-full bg-surface-container border border-outline/10 p-4 text-sm font-mono focus:border-primary/50 outline-none transition-all text-on-surface uppercase"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-primary uppercase tracking-widest">Descripción_Técnica</label>
          <textarea
            required
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe el problema, el contexto y lo que has intentado..."
            className="w-full bg-surface-container border border-outline/10 p-4 text-sm font-mono focus:border-primary/50 outline-none transition-all text-on-surface uppercase resize-none"
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-primary uppercase tracking-widest">Etiquetas (Presiona Enter)</label>
          <div className="flex flex-wrap gap-2 p-3 bg-surface-container border border-outline/10 min-h-[48px]">
            {tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 text-[9px] font-mono text-primary bg-primary/10 px-2 py-1 border border-primary/20">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-on-surface">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={addTag}
              placeholder={tags.length === 0 ? "Ej: KERNEL, C++, SECURITY" : ""}
              className="flex-grow bg-transparent border-none outline-none text-[10px] font-mono text-on-surface uppercase min-w-[100px]"
            />
          </div>
        </div>

        {/* Images */}
        <div className="space-y-4">
          <label className="text-[10px] font-mono text-primary uppercase tracking-widest">Evidencia_Visual</label>
          <div className="grid grid-cols-3 gap-4">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-square glass cyber-border overflow-hidden group">
                <Image src={img} alt="Preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(img)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square glass cyber-border border-dashed border-outline/20 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all group"
            >
              <Camera className="w-6 h-6 text-secondary/40 group-hover:text-primary transition-colors" />
              <span className="text-[8px] font-mono text-secondary/40 uppercase group-hover:text-primary transition-colors">
                {isUploading ? 'Subiendo...' : 'Subir_Archivo'}
              </span>
            </button>
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-outline/10">
          <div className="flex items-center gap-4 p-4 bg-primary/5 border border-primary/20 max-w-md">
            <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
            <p className="text-[9px] text-secondary font-mono leading-relaxed">
              RECUERDA SEGUIR LOS PROTOCOLOS DE ÉTICA DE LA SICI. LAS CONSULTAS DEBEN SER TÉCNICAS Y RESPETUOSAS.
            </p>
          </div>
          
          <button type="submit" className="hud-button px-12 py-5 flex items-center gap-3 w-full sm:w-auto">
            Publicar Consulta
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </Modal>
  );
}
