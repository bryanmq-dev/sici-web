import CommunityAreaPage from '@/components/CommunityAreaPage';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <CommunityAreaPage
      area="SPORTS"
      title="ISI Sports"
      description="Actividades deportivas y torneos de la carrera."
      comingSoonTitle="ISI Sports"
      comingSoonDescription="Actividades deportivas y torneos de la carrera."
    />
  );
}
