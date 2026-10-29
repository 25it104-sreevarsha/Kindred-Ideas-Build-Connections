import type { Member } from '@/types';

const normalize = (value: string) => value.trim().toLowerCase();

export function parseInterests(input: string): string[] {
  return input
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function findSharedInterests(userInterests: string[], memberInterests: string[]): string[] {
  const userSet = new Set(userInterests.map(normalize));
  return memberInterests.filter((interest) => userSet.has(normalize(interest)));
}

export function computeSparkScore(userInterests: string[], memberInterests: string[]): number {
  const shared = findSharedInterests(userInterests, memberInterests).length;
  const comparable = Math.min(userInterests.length, memberInterests.length);
  return comparable === 0 ? 0 : Math.round((shared / comparable) * 100);
}

export function joinNaturally(items: string[]): string {
  if (items.length <= 1) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

export function whyYouClick(sharedInterests: string[]): string {
  return sharedInterests.length > 0
    ? `You both light up around ${joinNaturally(sharedInterests)}, so the conversation can start itself.`
    : 'Your different angles could give each of you a fresh way of seeing things.';
}

export type { Member };
