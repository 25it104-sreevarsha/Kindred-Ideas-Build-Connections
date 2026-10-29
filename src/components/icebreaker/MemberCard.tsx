import type { CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import Avatar from '@/components/Avatar';
import type { Member } from '@/types';

interface MemberCardProps {
  member: Member;
  onSelect: (member: Member) => void;
  style?: CSSProperties;
}

export default function MemberCard({ member, onSelect, style }: MemberCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(member)}
      style={style}
      className="group animate-fade-up flex flex-col rounded-2xl bg-white/90 p-5 text-left shadow-md ring-1 ring-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-200/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200"
    >
      <div className="flex items-center gap-4">
        <Avatar
          name={member.name}
          tint={member.tint}
          className="h-14 w-14 text-lg transition duration-300 group-hover:scale-105"
        />
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-900">{member.name}</h3>
          <p className="truncate text-sm text-slate-600">{member.role}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {member.interests.map((interest) => (
          <span key={interest} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
            {interest}
          </span>
        ))}
      </div>

      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-700">
        Break the ice
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </button>
  );
}
