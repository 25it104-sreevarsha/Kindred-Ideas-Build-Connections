import { useCallback, useEffect, useState } from 'react';
import { createId } from '@/lib/ids';
import { HISTORY_LIMIT, loadHistory, saveHistory } from '@/lib/storage';
import type { HistoryEntry, HistoryKind } from '@/types';

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>(loadHistory);

  useEffect(() => {
    saveHistory(entries);
  }, [entries]);

  const addEntry = useCallback((kind: HistoryKind, text: string) => {
    setEntries((current) =>
      [{ id: createId(), kind, text, createdAt: Date.now() }, ...current].slice(0, HISTORY_LIMIT)
    );
  }, []);

  const clearEntries = useCallback(() => setEntries([]), []);

  return { entries, addEntry, clearEntries };
}
