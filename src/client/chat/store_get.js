import {chatCursor, getItemsCursor, curFocus, curPendingActions} from '../state';

export function getNewTodo() {
  return chatCursor();
}

export function getItems() {
  return getItemsCursor();
}

export function getFocus() {
  return curFocus();
}

export function getPendingActions() {
  return curPendingActions();
}
