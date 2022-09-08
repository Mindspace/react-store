import { createStore } from '@mindspace-io/react-store';
import type { CounterStore } from './counter.interfaces';

/**********************************************
 *  Purpose:
 *
 *  Demonstrate the use of simple state management
 *
 **********************************************/

export const useCounter = createStore<CounterStore>(({ set }) => ({
  count: 2,
  incrementCount() {
    set((s) => {
      s.count += 1;
    });
  },
  decrementCount() {
    // uses Immer to support deep mutations
    set((s) => {
      s.count -= 1;
    });
  },
}));

export type { CounterStore as CounterState };
