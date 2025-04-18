import ClientOnly from '@/components/ClientOnly';
import { TastingEdit } from '@/components/TastingEdit';
import { getTasting } from '@/lib/supabaseClient';

export default async function Page({ params }: any) {
  const { id } = params;
  const initialRecord = await getTasting(id);

  if (!initialRecord) return <div>Loading...</div>;

  return (
    <ClientOnly>
      <TastingEdit initialRecord={initialRecord} />;
    </ClientOnly>
  );
}
