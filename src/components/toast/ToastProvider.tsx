import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Check } from 'lucide-react';
import { ToastContext } from '@/components/toast/ToastContext';

interface Toast {
  id: number;
  text: string;
}

const TOAST_DURATION_MS = 2400;

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((text: string) => setToast({ id: Date.now(), text }), []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
        {toast && (
          <div
            key={toast.id}
            className="animate-fade-up flex max-w-full items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-xl"
          >
            <Check className="h-4 w-4 shrink-0 text-emerald-300" aria-hidden="true" />
            <span>{toast.text}</span>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}
