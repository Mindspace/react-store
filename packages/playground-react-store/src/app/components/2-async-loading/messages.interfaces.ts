import { State } from '@mindspace-io/react-store';

export interface MessagesState extends State {
  isLoading?: boolean;
  timeToReady: number;
  messages: string[];

  // Mutators
  refresh: () => void;
}
