import { getSocietyUnits, getSocietyMemberships } from '@/lib/actions/organization';
import TeamClient from './TeamClient';

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
  const units = await getSocietyUnits();
  const memberships = await getSocietyMemberships();

  return (
      <main className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <TeamClient units={units} memberships={memberships} />
        </div>
      </main>
  );
}
