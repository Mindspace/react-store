import { useState, useCallback } from 'react';
import { CounterState } from './counter.interfaces';

export function useCounter(): CounterState {
  const [count, setCount] = useState(0);

  const incrementCount = useCallback(() => {
    setCount((prev) => prev + 1);
  }, [setCount]);

  return {
    count,
    incrementCount,
  };
}
