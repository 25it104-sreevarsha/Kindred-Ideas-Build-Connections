import { useState } from 'react';
import { Loader2, Wand2 } from 'lucide-react';
import CopyButton from '@/components/CopyButton';
import ToneToggle from '@/components/ToneToggle';
import { rewriteWarmer } from '@/lib/ai';
import type { Tone } from '@/types';

interface WarmerResult {
  original: string;
  warmer: string;
}

export default function SayItBetterTab() {
  const [draft, setDraft] = useState('');
  const [tone, setTone] = useState<Tone>('casual');
  const [result, setResult] = useState<WarmerResult | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = draft.trim().length > 0 && !loading;

  async function handleMakeWarmer() {
    const original = draft.trim();
    setLoading(true);
    const warmer = await rewriteWarmer(original, tone);
    setResult({ original, warmer });
    setLoading(false);
  }

  return (
    <div className="space-y-10">
      <section className="animate-fade-up mx-auto max-w-3xl rounded-3xl bg-white/80 p-6 shadow-xl shadow-indigo-200/40 ring-1 ring-white backdrop-blur sm:p-8">
        <h1 className="text-3xl font-bold leading-[1.2] text-slate-900 sm:text-4xl">Say it, but warmer</h1>
        <p className="mt-2 text-slate-700">
          Paste the message you are worried about sending. We will soften it while keeping what you mean.
        </p>

        <label className="mt-6 block">
          <span className="sr-only">Your message</span>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={5}
            placeholder="Type a message you're nervous to send"
            className="w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 leading-normal text-slate-900 placeholder:text-slate-500 outline-none transition duration-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
          />
        </label>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <ToneToggle value={tone} onChange={setTone} />
          <button
            type="button"
            onClick={handleMakeWarmer}
            disabled={!canSubmit}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 px-6 py-3 font-semibold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                Warming it up...
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5" aria-hidden="true" />
                Make it warmer
              </>
            )}
          </button>
        </div>
      </section>

      {result && (
        <section className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <article className="animate-fade-up rounded-3xl bg-white/85 p-6 shadow-md ring-1 ring-slate-200">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">Before</h2>
            <p className="mt-4 whitespace-pre-line leading-normal text-slate-800">{result.original}</p>
          </article>

          <article className="animate-fade-up rounded-3xl bg-gradient-to-br from-indigo-50 to-pink-50 p-6 shadow-lg ring-1 ring-indigo-100">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-indigo-800">After</h2>
            <p className="mt-4 whitespace-pre-line leading-normal text-slate-900">{result.warmer}</p>
            <div className="mt-5">
              <CopyButton text={result.warmer} />
            </div>
          </article>
        </section>
      )}
    </div>
  );
}
