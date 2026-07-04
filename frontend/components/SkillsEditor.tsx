'use client';

import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { addUserSkill, removeUserSkill } from '@/lib/actions/profile';

interface Skill {
  id: string;
  skillName: string;
}

export default function SkillsEditor({ skills, editable }: { skills: Skill[]; editable: boolean }) {
  const [newSkill, setNewSkill] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    setIsAdding(true);
    try {
      await addUserSkill({ skillName: newSkill.trim() });
      setNewSkill('');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {skills.map((skill) => (
        <span key={skill.id} className="badge flex items-center gap-1.5">
          {skill.skillName}
          {editable && (
            <button onClick={() => removeUserSkill(skill.id)} className="hover:text-red-500 transition-colors">
              <X className="w-3 h-3" />
            </button>
          )}
        </span>
      ))}
      {skills.length === 0 && <span className="text-sm text-text-muted">Sin skills registradas</span>}
      {editable && (
        <form onSubmit={handleAdd} className="flex items-center gap-1">
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Nueva skill"
            className="input text-xs py-1 px-2 w-28"
          />
          <button type="submit" disabled={isAdding} className="p-1.5 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors disabled:opacity-50">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </form>
      )}
    </div>
  );
}
