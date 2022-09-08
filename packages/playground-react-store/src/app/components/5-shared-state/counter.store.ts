import { createStore, QueryList } from '@mindspace-io/react-store';
import { CounterState } from './counter.interfaces';

export type ViewModel = QueryList<
  CounterState,
  [number, () => void, () => void]
>;

export const useCounter = createStore<CounterState>(({ set }) => ({
  count: 0,
  messages: [],
  incrementCount() {
    set((d) => {
      d.count += 1;
    });
  },
}));
