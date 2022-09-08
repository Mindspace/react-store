import { QueryList, State } from '@mindspace-io/react-store';

export interface QAStore extends State {
  // Data
  question: string;
  answer: string;

  // Mutators
  updateQuestion: (answer: string) => void;
}

/*******************************************
 * Define the view model
 * Define a selector function to extract ViewModel from `useStore(<selector>)`
 *******************************************/

export type QAViewModel = [string, string, (question: string) => void];

export const query: QueryList<QAStore, QAViewModel> = [
  (s: QAStore) => s.question,
  (s: QAStore) => s.answer,
  (s: QAStore) => s.updateQuestion,
];
