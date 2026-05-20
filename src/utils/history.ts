export interface HistoryItem {
  calcId: string;
  catId: string;
  name: string;
  emoji: string;
  timestamp: number;
}

const HISTORY_KEY = 'jeongbu_history';

export function saveHistory(item: Omit<HistoryItem, 'timestamp'>) {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    let history: HistoryItem[] = raw ? JSON.parse(raw) : [];
    
    // Remove existing if it's the same calculator
    history = history.filter(h => h.calcId !== item.calcId);
    
    // Add to front
    history.unshift({ ...item, timestamp: Date.now() });
    
    // Keep only last 10
    if (history.length > 10) history = history.slice(0, 10);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save history', e);
  }
}

export function getHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}
