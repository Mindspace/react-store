import { switchCase } from '@mindspace-io/core';
import { createStore, State, QueryList } from '@mindspace-io/react-store';

import { TodosService } from './todo.service';
import { VisibilityFilter, Todo } from './todo.model';

function toggleCompleted(todo: Todo) {
  return { completed: !todo.completed };
}

export interface History {
  hasPast: boolean;
  hasFuture: boolean;
  undo: () => void;
  redo: () => void;
}

export interface TodoFacade {
  addTodo: (text: string) => void;
  deleteTodo: ({ id }) => void;
  toggleComplete: ({ id }) => void;
  updateFilter: (filter: VisibilityFilter) => void;
  history: History;
}

export interface TodoStore extends State {
  allTodos: Todo[];
  todos: Todo[];
  filter: VisibilityFilter;
  facade: TodoFacade;
}

/**
 * Publish Todo list that matches the visbility filter
 */
function gatherVisibleTodos([todos, filter]): Todo[] {
  const withFilter = switchCase(
    {
      [VisibilityFilter.SHOW_ACTIVE]: () => todos.filter((t) => !t.completed),
      [VisibilityFilter.SHOW_COMPLETED]: () => todos.filter((t) => t.completed),
    },
    todos || []
  );
  return withFilter(filter);
}

export const useTodoStore = createStore<TodoStore>(
  ({ set, addComputedProperty }) => {
    const api = new TodosService();
    const store = {
      allTodos: [],
      filter: VisibilityFilter.SHOW_ALL,
      todos: [],
      facade: {
        async addTodo(text: string) {
          const todo = await api.addTodo(text);
          set((s: TodoStore) => {
            s.allTodos.push(todo);
          });
        },
        deleteTodo({ id }) {
          api.deleteTodo(id).then(() => {
            set((s: TodoStore) => {
              s.allTodos = s.allTodos.filter((it) => it.id !== id);
            });
          });
        },
        toggleComplete({ id }) {
          const toggleItem = (it) => {
            return it.id !== id ? it : { ...it, ...toggleCompleted(it) };
          };

          set((s: TodoStore) => {
            s.allTodos = s.allTodos.map(toggleItem);

            const showingCompletedOnly =
              s.filter === VisibilityFilter.SHOW_COMPLETED;
            const hasCompletedItems = s.allTodos.reduce((found, it) => {
              return found || it.completed;
            }, false);

            if (showingCompletedOnly && !hasCompletedItems) {
              s.filter = VisibilityFilter.SHOW_ALL;
            }
          });
        },
        updateFilter(filter: VisibilityFilter) {
          set((s: TodoStore) => {
            s.filter = filter;
          });
        },
        history: {
          undo: () => {},
          redo: () => {},
          hasPast: false,
          hasFuture: false,
        },
      },
    };

    return addComputedProperty(store, {
      name: 'todos',
      selectors: [(s: TodoStore) => s.allTodos, (s: TodoStore) => s.filter],
      transform: gatherVisibleTodos,
    });
  }
);

export type TodosViewModel = [Todo[], VisibilityFilter, TodoFacade];
export type StoreQuery = QueryList<TodoStore, TodosViewModel>;

export const query = <StoreQuery>[
  (s: TodoStore) => s.todos,
  (s: TodoStore) => s.filter,
  (s: TodoStore) => s.facade,
];
