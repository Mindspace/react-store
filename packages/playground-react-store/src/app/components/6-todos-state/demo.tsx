// ************************************
//  Demonstrate how traditional React hooks do not
//  naturally share state
//
//  Toggle the imports to test Hooks vs Store
// ************************************

import { FC } from 'react';

import { QueryList } from '@mindspace-io/react-store';
import { useTodoStore, Todo, TodoFacade, TodoStore } from './todos';

export type StoreViewModel = [Todo[], TodoFacade];
export const vmQuery: QueryList<TodoStore, StoreViewModel> = [
  (store) => store.todos,
  (store) => store.facade,
];

export const TodoList: FC = () => {
  //const {todos, facade} = useTodoStore();
  const [todos, facade] = useTodoStore<StoreViewModel>(vmQuery);

  return (
    <div className="row">
      <div>
        <h4>Todos Store</h4>={' '}
        <button onClick={() => facade.addTodo(`Todo #${todos.length + 1}`)}>
          Increment
        </button>
      </div>
      <div>
        {todos.map((it) => {
          return <p key={it.id}>{it.text}</p>;
        })}
      </div>
    </div>
  );
};
