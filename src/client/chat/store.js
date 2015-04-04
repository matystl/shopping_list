import * as actions from './actions';
import {Range, Record} from 'immutable';
import {chatCursor, getItemsCursor} from '../state';
import {register} from '../dispatcher';
import {socket} from '../socket';
import Immutable from 'immutable';

socket.on('new chat from room', function(msg){
   console.log(msg);
   actions.newMessageFromServer(msg);
 });

 socket.on('new items', function(msg){
    console.log(`new items from server ${msg}`);
    actions.newItemsFromServer(msg);
  });

export const dispatchToken = register(({action, data}) => {
  switch (action) {

    case actions.openTodo: {
      const x = 5;
      console.log(`Will join ${data}`);
      socket.emit(`join room`, data);
      break;
    }



    case actions.onEditItemText: {
      const {itemId, value} = data;
      console.log(`item id ${itemId} val ${value}`);
      getItemsCursor(items => items.map((item) => (item.get("id") == itemId)? item.set("text", value): item));
      socket.emit(`edit item`, {id: itemId, value: value});
      break;
    };



      // Always use destructing vars. It's explicit.
      // const {name, value} = data;
      // newTodoCursor(todo => todo.set(name, value));
      // socket.emit('chat message', {"name":name, "value":value});
      // break;
    case actions.newMessageFromServer: {
      const {text, dataMap} = data;
      const {name, value} = dataMap;
      console.log(`setting cursor ${name} ${value}`);
      chatCursor(todo => todo.set(name, value));
      break;
    };


    case actions.newItemsFromServer: {
      const newData = JSON.parse(JSON.stringify(data));
      console.log(`new items from server ${JSON.stringify(newData)}`);
      getItemsCursor(items => Immutable.fromJS(newData));
      break;
    };


    case actions.closeTodo: {
      const x = 8;
      console.log(`Will leave ${data}`);
      socket.emit(`leave room`, data);
      break;
    }
      //
      // todo = data;
      // todosCursor(todos => todos.push(new TodoItem({
      //   id: getRandomString(),
      //   title: todo.get('title')
      // }).toMap()));
      // newTodoCursor(todo => new TodoItem().toMap());
      // break;



    case actions.onNewTodoFieldChange:
      // Always use destructing vars. It's explicit.
      const {name, value} = data;
      chatCursor(todo => todo.set(name, value));
      socket.emit('chat in room', {"name":name, "value":value});
      break;
  }

});
