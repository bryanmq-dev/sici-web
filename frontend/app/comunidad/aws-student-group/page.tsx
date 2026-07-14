import CommunityAreaPage from '@/components/CommunityAreaPage';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <CommunityAreaPage
      area="AWS"
      title="AWS Student Group"
      description="Comunidad de cloud computing y certificaciones AWS."
      comingSoonTitle="AWS Student Group"
      comingSoonDescription="Comunidad de cloud computing y certificaciones AWS."
    />
  );
}
