interface AvatarProps {
  name: string;
  tint: string;
  className?: string;
}

export default function Avatar({ name, tint, className = '' }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${tint} font-semibold text-white shadow-md ${className}`}
    >
      {initials}
    </div>
  );
}
