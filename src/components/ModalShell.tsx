import { useEffect, type ReactNode } from 'react';

interface ModalShellProps {
  titleId: string;
  onClose: () => void;
  placement?: 'center' | 'drawer';
  children: ReactNode;
}

export default function ModalShell({ titleId, onClose, placement = 'center', children }: ModalShellProps) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const isDrawer = placement === 'drawer';

  return (
    <div
      role="presentation"
      onClick={onClose}
      className={`animate-fade-in fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm ${
        isDrawer ? '' : 'flex items-end justify-center sm:items-center sm:p-4'
      }`}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className={
          isDrawer
            ? 'animate-slide-in-right absolute inset-y-0 right-0 flex w-full flex-col bg-white shadow-2xl sm:max-w-md'
            : 'animate-scale-in max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-8'
        }
      >
        {children}
      </div>
    </div>
  );
}
