import type { Tone } from '@/types';

const OPTIONS: { value: Tone; label: string }[] = [
  { value: 'casual', label: 'Casual' },
  { value: 'professional', label: 'Professional' },
  { value: 'shy', label: 'Shy-friendly' },
];

interface ToneToggleProps {
  value: Tone;
  onChange: (tone: Tone) => void;
}

export default function ToneToggle({ value, onChange }: ToneToggleProps) {
  return (
    <div role="radiogroup" aria-label="Tone" className="inline-flex flex-wrap gap-1 rounded-full bg-slate-100 p-1">
      {OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
              active
                ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-md'
                : 'text-slate-700 hover:bg-white hover:text-indigo-700'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
