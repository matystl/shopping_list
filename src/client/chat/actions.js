import setToString from '../../lib/settostring';
import {dispatch} from '../dispatcher';


export function syncStartTodo(todoId) {
  dispatch(syncStartTodo, todoId);
}

export function syncStopTodo(todoId) {
  dispatch(syncStopTodo, todoId);
}

export function onEditItemText({target: {name, value}}, itemId) {
  switch (name) {
    case 'text':
      value = value.slice(0, 40);
      break;
  }
  dispatch(onEditItemText, {itemId, value});
}

export function onAddItem(e, prevItemId) {
  if (e.key === `Enter`) {
    console.log(`I pressed eneter`);
    dispatch(onAddItem, prevItemId);
  }
  e.stopPropagation();
}

export function onNewItemsFromServer(msg, decreasePendingActions) {
  dispatch(onNewItemsFromServer, {msg, decreasePendingActions});
}



// Override actions toString for logging.
setToString('chat', {
  syncStartTodo, syncStopTodo,
  onEditItemText, onNewItemsFromServer, onAddItem
});
