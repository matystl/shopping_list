import {newTodoCursor, todosCursor} from '../state';

export function getNewTodo() {
  return newTodoCursor();
}

export function getTodos() {
  return todosCursor();
}
