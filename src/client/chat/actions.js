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


export function onTodoInputKeyDown(e, prevItemId) {
  let disableDefault = true;
  if (e.key === `Enter`) {
    onAddItem(prevItemId);
  } else if (e.key === `ArrowUp`) {
    onMove(prevItemId, -1);
  } else if (e.key === `ArrowDown`) {
    onMove(prevItemId, +1);
    console.log(`I pressed down`);
  } else if (e.key === `Backspace`) {
    console.log(`Backspace ${e.target.value}`);
    if (e.target.value === ``) {
      onDeleteItem(prevItemId)
    } else {
      disableDefault = false;
    }
    //onDeleteItem(prevItemId);
  } else {
    disableDefault = false;
    console.log(`I pressed ${e.key}`);
  };
  if (disableDefault) {
    e.stopPropagation();
    e.preventDefault();
  }
}

export function onDeleteItem(itemId) {
  dispatch(onDeleteItem, itemId);
}

export function onFocus(itemId) {
  dispatch(onFocus, itemId);
}

export function onMove(prevItemId, direction) {
  console.log(`I pressed up`);
  dispatch(onMove, {id: prevItemId, direction});
}

export function onAddItem(prevItemId) {
  console.log(`I pressed eneter`);
  dispatch(onAddItem, prevItemId);
}

export function onNewItemsFromServer(msg, decreasePendingActions) {
  dispatch(onNewItemsFromServer, {msg, decreasePendingActions});
}



// Override actions toString for logging.
setToString('chat', {
  syncStartTodo, syncStopTodo, onDeleteItem,
  onEditItemText, onNewItemsFromServer, onAddItem, onMove, onFocus
});
