import setToString from '../../lib/settostring';
import {dispatch} from '../dispatcher';

export function onEditItemText({target: {name, value}}, itemId) {
  switch (name) {
    case 'text':
      value = value.slice(0, 40);
      break;
  }
  dispatch(onEditItemText, {itemId, value});
}

export function onNewTodoFieldChange({target: {name, value}}) {
  switch (name) {
    case 'title':
      value = value.slice(0, 40);
      break;
  }
  dispatch(onNewTodoFieldChange, {name, value});
}

export function newItemsFromServer(msg) {
  dispatch(newItemsFromServer, msg);
}

export function messageFromServer(msg) {
  dispatch(messageFromServer, msg);
}

export function openTodo(todoId) {
  dispatch(openTodo, todoId);
}

export function closeTodo(todoId) {
  dispatch(closeTodo, todoId);
}

export function newMessageFromServer(message) {
  dispatch(newMessageFromServer, message);
}

// Override actions toString for logging.
setToString('chat', {
  newMessageFromServer, openTodo, closeTodo, onNewTodoFieldChange, messageFromServer, onEditItemText, newItemsFromServer
});
