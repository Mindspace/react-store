import { createStore, State, Query } from '@mindspace-io/react-store';

import { TodosService } from './todo.service';
import { VisibilityFilter, Todo } from './todo.model';

function toggleCompleted(todo: Todo) {
  return { completed: !todo.completed };
}

export interface History {
  hasPast: boolean;
  undo: () => void;
  redo: () => void;
}

export interface TodoFacade {
  addTodo: (text: string) => void;
  deleteTodo: ({ id }: { id: string }) => void;
  toggleComplete: ({ id }: { id: string }) => void;
  updateFilter: (filter: VisibilityFilter) => void;
  history: History;
}

export interface TodoStore extends State {
  todos: Todo[];
  filter: VisibilityFilter;
  facade: TodoFacade;
}

export const useTodoStore = createStore<TodoStore>(({ set }) => {
  const api = new TodosService();

  return {
    todos: [{ id: 1, text: 'Thomas Burleson', completed: false }],
    filter: VisibilityFilter.SHOW_ALL,

    facade: {
      addTodo(text: string) {
        api.addTodo(text).then((todo) => {
          console.log(todo);
          set((s: TodoStore) => {
            s.todos.push(todo);
          });
        });
      },
      deleteTodo({ id }) {
        set((s: TodoStore) => {
          api.deleteTodo(id).then(() => {
            s.todos = s.todos.filter((it) => it.id !== id);
          });
        });
      },
      toggleComplete({ id }) {
        set((s: TodoStore) => {
          s.todos = s.todos.map((it) => {
            return it.id !== id ? it : { ...it, ...toggleCompleted(it) };
          });
        });
      },
      updateFilter(filter: VisibilityFilter) {
        set((s: TodoStore) => {
          s.filter = filter;
        });
      },
      history: { undo: () => {}, redo: () => {}, hasPast: false },
    },
  };
});
