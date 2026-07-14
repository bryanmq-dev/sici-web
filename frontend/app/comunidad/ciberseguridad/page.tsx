import CommunityAreaPage from '@/components/CommunityAreaPage';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <CommunityAreaPage
      area="HACKING"
      title="Comunidad de Ciberseguridad"
      description="CTFs, pentesting y seguridad ofensiva/defensiva."
      comingSoonTitle="Comunidad de Ciberseguridad"
      comingSoonDescription="CTFs, pentesting y seguridad ofensiva/defensiva."
    />
  );
}
