import ClientOnly from '@/components/ClientOnly';
import { TastingEdit } from '@/components/TastingEdit';
import { getTasting } from '@/lib/supabaseClient';

interface Props {
  params: {
    id: string
  }
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const initialRecord = await getTasting(id);

  if (!initialRecord) return <div>Loading...</div>;

  return (
    <ClientOnly>
      <TastingEdit initialRecord={initialRecord} />;
    </ClientOnly>
  );
}
