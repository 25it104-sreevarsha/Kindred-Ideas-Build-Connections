import type { HistoryEntry } from '@/types';

export const HISTORY_LIMIT = 30;
const HISTORY_KEY = 'kindred.history';

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== 'object' || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === 'string' &&
    (entry.kind === 'icebreaker' || entry.kind === 'rewrite') &&
    typeof entry.text === 'string' &&
    typeof entry.createdAt === 'number'
  );
}

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isHistoryEntry).slice(0, HISTORY_LIMIT) : [];
  } catch {
    return [];
  }
}

export function saveHistory(entries: HistoryEntry[]): void {
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
  } catch {
    // Storage can be full or disabled; history simply stays in memory.
  }
}
