'use client';

import { ReactNode, useState, useEffect } from 'react';

interface Props { children: ReactNode; fallback?: ReactNode }

export default function ClientOnly({ children, fallback = <div>Loading…</div> }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <>{mounted ? children : fallback}</>;
}
