import { useEffect, useState } from 'react';
import { Loader2, RefreshCw, Sparkles, X } from 'lucide-react';
import Avatar from '@/components/Avatar';
import CopyButton from '@/components/CopyButton';
import { generateIcebreaker } from '@/lib/ai';
import { findSharedInterests, joinNaturally } from '@/lib/interests';
import type { Member, Tone } from '@/types';

interface IcebreakerModalProps {
  member: Member;
  senderName: string;
  senderInterests: string[];
  tone: Tone;
  onClose: () => void;
}

const SECONDARY_BUTTON =
  'inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm ring-1 ring-indigo-200 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0';

export default function IcebreakerModal({ member, senderName, senderInterests, tone, onClose }: IcebreakerModalProps) {
  const sharedInterests = findSharedInterests(senderInterests, member.interests);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  async function handleGenerate() {
    setLoading(true);
    const text = await generateIcebreaker({ member, sharedInterests, tone, senderName });
    setMessage(text);
    setLoading(false);
  }

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="animate-fade-in fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-sm sm:items-center sm:p-4"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="icebreaker-title"
        onClick={(event) => event.stopPropagation()}
        className="animate-scale-in max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-8"
      >
        <div className="flex items-start gap-4">
          <Avatar name={member.name} tint={member.tint} className="h-16 w-16 text-xl" />
          <div className="min-w-0 flex-1">
            <h2 id="icebreaker-title" className="text-xl font-bold leading-[1.2] text-slate-900">
              {member.name}
            </h2>
            <p className="mt-1 text-sm text-slate-600">{member.role}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <section className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Common ground</h3>
          {sharedInterests.length > 0 ? (
            <div className="mt-3">
              <p className="text-slate-800">You both enjoy {joinNaturally(sharedInterests)}.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {sharedInterests.map((interest) => (
                  <span key={interest} className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-800">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-3 rounded-2xl bg-pink-50 p-4 font-medium text-pink-900">
              Different worlds, great for new perspectives
            </p>
          )}
        </section>

        <section className="mt-6">
          {message === null ? (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 px-5 py-3 font-semibold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-wait disabled:opacity-80 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  Writing something warm...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                  Generate Icebreaker
                </>
              )}
            </button>
          ) : (
            <div className="animate-fade-up">
              <div
                className={`rounded-2xl bg-gradient-to-br from-indigo-50 to-pink-50 p-5 ring-1 ring-indigo-100 transition-opacity duration-200 ${
                  loading ? 'opacity-60' : ''
                }`}
              >
                <p className="whitespace-pre-line leading-normal text-slate-800">{message}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <CopyButton text={message} />
                <button type="button" onClick={handleGenerate} disabled={loading} className={SECONDARY_BUTTON}>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  )}
                  {loading ? 'Writing...' : 'Regenerate'}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
