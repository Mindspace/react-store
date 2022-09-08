import { QueryList, State } from '@mindspace-io/react-store';

export interface MessagesStore extends State {
  filterBy: string;
  messages: string[];
  updateFilter: (filterBy: string) => void;
  filteredMessages: string[];
}

export type MessagesViewModel = [string, string[], (v: string) => void];

export const query: QueryList<MessagesStore, MessagesViewModel> = [
  (s: MessagesStore) => s.filterBy,
  (s: MessagesStore) => s.filteredMessages,
  (s: MessagesStore) => s.updateFilter,
];
