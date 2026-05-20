import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useUrlState<T>(key: string, initialValue: T): [T, (val: T) => void] {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Read initial from URL or fallback to initialValue
  const [state, setState] = useState<T>(() => {
    const param = searchParams.get(key);
    if (param !== null) {
      try {
        return JSON.parse(decodeURIComponent(param));
      } catch (e) {
        return initialValue;
      }
    }
    return initialValue;
  });

  // Update state and URL
  const setUrlState = useCallback((newValue: T) => {
    setState(newValue);
    setSearchParams((prev) => {
      prev.set(key, encodeURIComponent(JSON.stringify(newValue)));
      return prev;
    }, { replace: true });
  }, [key, setSearchParams]);

  return [state, setUrlState];
}
