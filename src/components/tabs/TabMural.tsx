'use client';

import type { AppTab } from '@/components/TabBar';

type TabMuralProps = {
  onNavigate: (tab: AppTab) => void;
};

export default function TabMural(_: TabMuralProps) {
  return (
    <iframe
      src="/mural"
      className="w-full border-0"
      style={{ height: 'calc(100vh - 4rem)' }}
      title="Mural ao vivo"
    />
  );
}
