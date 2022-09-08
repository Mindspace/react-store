import { State } from '@mindspace-io/react-store';

export interface CounterState extends State {
  count: number;
  incrementCount: () => void;
}
