import { useState, useCallback } from 'react';
import { CounterStore } from './counter.interfaces';

export function useCounter(): CounterStore {
  const [count, setVisits] = useState(0);

  const incrementCount = useCallback(() => {
    setVisits((prev) => prev + 1);
  }, [setVisits]);

  const decrementCount = useCallback(() => {
    setVisits((prev) => prev - 1);
  }, [setVisits]);

  return {
    count,
    incrementCount,
    decrementCount,
  };
}
