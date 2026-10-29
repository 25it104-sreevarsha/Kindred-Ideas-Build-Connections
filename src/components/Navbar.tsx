import { Handshake } from 'lucide-react';
import type { Tab } from '@/types';

const TABS: { value: Tab; label: string }[] = [
  { value: 'icebreaker', label: 'Icebreaker' },
  { value: 'sayItBetter', label: 'Say it Better' },
];

interface NavbarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function Navbar({ activeTab, onTabChange }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/75 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-pink-500 text-white shadow-md">
            <Handshake className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold leading-tight text-slate-900">Kindred</p>
            <p className="hidden text-xs text-slate-600 sm:block">Ideas build connections.</p>
          </div>
        </div>

        <nav aria-label="Main" className="flex gap-1 rounded-full bg-slate-100 p-1">
          {TABS.map((tab) => {
            const active = tab.value === activeTab;
            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onTabChange(tab.value)}
                aria-current={active ? 'page' : undefined}
                className={`rounded-full px-3 py-2 text-sm font-medium transition-all duration-200 sm:px-4 ${
                  active
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-indigo-600'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
