import { createTodo } from './todo.model';

export class TodosService {
  loadAll() {
    // @Todo - load all from cache or server...
    return Promise.resolve([]);
  }

  addTodo(text: string) {
    // @Todo - Save to server...
    return Promise.resolve(createTodo(text));
  }

  deleteTodo(todoID: string) {
    return Promise.resolve(true);
  }
}
