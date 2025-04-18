import ClientOnly from '@/components/ClientOnly';
import { TastingList } from '@/components/TastingList';
import { getAllTastings } from '@/lib/supabaseClient';

export default async function Page() {
  const initialRecords = await getAllTastings();

  if (!initialRecords) return <div>Loading...</div>;

  return (
    <ClientOnly>
      <TastingList initialRecords={initialRecords} />;
    </ClientOnly>
  );
}
