import { useState } from 'react';
import MemberCard from '@/components/icebreaker/MemberCard';
import IcebreakerModal from '@/components/icebreaker/IcebreakerModal';
import ToneToggle from '@/components/ToneToggle';
import { MEMBERS } from '@/data/members';
import { parseInterests } from '@/lib/interests';
import type { Member, Tone } from '@/types';

const INPUT_CLASS =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-500 outline-none transition duration-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100';

export default function IcebreakerTab() {
  const [name, setName] = useState('');
  const [interestsInput, setInterestsInput] = useState('');
  const [tone, setTone] = useState<Tone>('casual');
  const [selected, setSelected] = useState<Member | null>(null);

  const interests = parseInterests(interestsInput);

  return (
    <div className="space-y-10">
      <section className="animate-fade-up rounded-3xl bg-white/80 p-6 shadow-xl shadow-indigo-200/40 ring-1 ring-white backdrop-blur sm:p-8">
        <h1 className="text-3xl font-bold leading-[1.2] text-slate-900 sm:text-4xl">Find your first hello</h1>
        <p className="mt-2 max-w-2xl text-slate-700">
          Tell us a little about you, then pick someone to meet. We will help you find the right words.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-800">Your name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Alex Morgan"
              className={INPUT_CLASS}
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-800">Your interests</span>
            <input
              type="text"
              value={interestsInput}
              onChange={(event) => setInterestsInput(event.target.value)}
              placeholder="Football, Anime, Web Dev"
              className={INPUT_CLASS}
            />
            <span className="mt-2 block text-xs text-slate-600">Separate with commas to find common ground.</span>
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-medium text-slate-800">Icebreaker tone</span>
          <ToneToggle value={tone} onChange={setTone} />
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
          <h2 className="text-xl font-semibold leading-[1.2] text-slate-900">Community members</h2>
          <p className="text-sm text-slate-700">Select someone to see your common ground</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {MEMBERS.map((member, index) => (
            <MemberCard
              key={member.id}
              member={member}
              onSelect={setSelected}
              style={{ animationDelay: `${index * 60}ms` }}
            />
          ))}
        </div>
      </section>

      {selected && (
        <IcebreakerModal
          key={selected.id}
          member={selected}
          senderName={name}
          senderInterests={interests}
          tone={tone}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
