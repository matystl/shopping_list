import {chatCursor, getItemsCursor} from '../state';

export function getNewTodo() {
  return chatCursor();
}

export function getItems() {
  return getItemsCursor();
}
