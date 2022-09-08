import { State, Query } from '@mindspace-io/react-store';

/*******************************************
 * Define the view model + a selector function to extract ViewModel
 *******************************************/

export interface CounterStore extends State {
  count: number;
  incrementCount: () => void;
  decrementCount: () => void;
}

export type CounterViewModel = [number, () => void, () => void];
export type QueryCounter = Query<CounterStore, CounterViewModel>;

export const query: QueryCounter = (s: CounterStore) => [
  s.count,
  s.decrementCount,
  s.incrementCount,
];
