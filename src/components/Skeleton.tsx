interface SkeletonLinesProps {
  lines?: number;
}

export default function SkeletonLines({ lines = 3 }: SkeletonLinesProps) {
  return (
    <div className="space-y-2.5" role="status" aria-label="Loading">
      {Array.from({ length: lines }, (_, index) => (
        <div
          key={index}
          className={`h-3.5 animate-pulse rounded-full bg-slate-200 ${index === lines - 1 ? 'w-2/3' : 'w-full'}`}
        />
      ))}
    </div>
  );
}
