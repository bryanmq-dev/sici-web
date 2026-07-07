'use client';

import React, { useState, useTransition } from 'react';
import { UserPlus } from 'lucide-react';
import { addTeamMembers } from '@/lib/actions/incubator';
import { getErrorMessage } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface AvailableUser {
  id: string;
  name: string;
}

export default function AddTeamMembersForm({ projectId, availableUsers }: { projectId: string; availableUsers: AvailableUser[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const toggle = (userId: string) => {
    setSelected((prev) => prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]);
  };

  const handleSubmit = () => {
    setError('');
    startTransition(async () => {
      try {
        await addTeamMembers(projectId, selected);
        setSelected([]);
        router.refresh();
      } catch (err) {
        setError(getErrorMessage(err));
      }
    });
  };

  if (availableUsers.length === 0) return null;

  return (
    <div className="border-t border-border pt-4 mt-4 space-y-3">
      <h4 className="text-xs text-text-muted uppercase tracking-wide">Registrar equipo de desarrollo</h4>
      <div className="max-h-48 overflow-y-auto space-y-1 border border-border rounded-lg p-2">
        {availableUsers.map((u) => (
          <label key={u.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-surface-hover cursor-pointer text-sm text-text-primary">
            <input
              type="checkbox"
              checked={selected.includes(u.id)}
              onChange={() => toggle(u.id)}
              className="accent-primary"
            />
            {u.name}
          </label>
        ))}
      </div>
      {error && <div className="badge badge-error">{error}</div>}
      <button
        onClick={handleSubmit}
        disabled={selected.length === 0 || isPending}
        className="btn-primary flex items-center justify-center gap-2 p-2 rounded-sm w-full disabled:opacity-50"
      >
        <UserPlus className="w-4 h-4" /> {isPending ? 'Agregando...' : `Agregar ${selected.length || ''} al equipo`}
      </button>
    </div>
  );
}
