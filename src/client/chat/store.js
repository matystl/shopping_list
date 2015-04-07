import * as actions from './actions';
import {Range, Record} from 'immutable';
import {chatCursor, getItemsCursor, curServerIdMapping, curFocus,
  curItemsOrder, curPendingActions} from '../state';
import {register} from '../dispatcher';
import {socket} from '../socket';
import Immutable from 'immutable';
import uuid from 'node-uuid';

socket.on('new chat from room', function(msg){
   console.log(msg);
   actions.newMessageFromServer(msg);
 });

socket.on('new items', function(msg){
    console.log(`new items from server ${msg}`);
    actions.newItemsFromServer(msg, false);
});

socket.on('confirm new items', function(msg){
    console.log(`new items from server ${msg}`);
    actions.newItemsFromServer(msg, true);
});


export const dispatchToken = register(({action, data}) => {
  switch (action) {

    case actions.openTodo: {
      const x = 5;
      console.log(`Will join ${data}`);
      socket.emit(`join room`, data);
      break;
    }

    case actions.onAddItem: {
      const prevItemId = data;
      const clientId = uuid.v4();
      console.log(`new item id ${clientId} and prev item id ${prevItemId}`);
      getItemsCursor((items) => items.push(Immutable.fromJS({"id": clientId,"text":"", "checked": true})));
      console.log(`What is curItemsOrder ${curItemsOrder()}`);
      curItemsOrder((order) => {
        console.log(`This has been called?`);
        const iOrder = Immutable.fromJS(JSON.parse(JSON.stringify(order)));
        console.log(`what is in iOrder >${iOrder}< size ${iOrder.size} search ${prevItemId}`);
        const prevIndex = iOrder.indexOf(prevItemId);
        console.log(`prev index ${prevIndex}`);
        console.log(`type ${Object.prototype.toString.call(order)}`);

        console.log(`type ${Object.prototype.toString.call(iOrder)}`);
        return iOrder.splice(prevIndex + 1,0, clientId);
      });
      console.log(`after change of order`);
      curFocus((_) => clientId);
      curPendingActions((c) => c+1);
      console.log(JSON.stringify(getItemsCursor()));
      socket.emit(`add item`, clientId);
      break;
    }


    case actions.onEditItemText: {
      const {itemId, value} = data;
      console.log(`item id ${itemId} val ${value}`);
      getItemsCursor(items => items.map((item) => (item.get("id") == itemId)? item.set("text", value): item));
      curPendingActions((c) => c+1);
      socket.emit(`edit item`, {id: itemId, value: value});
      break;
    };


    case actions.newItemsFromServer: {
      const {msg, decreasePendingActions} = data;

      const newData = JSON.parse(JSON.stringify(msg));
      console.log(`new items from server ${JSON.stringify(newData)}`);
      if (decreasePendingActions) {
        curPendingActions((c) => (c >0)? c-1 : 0);
        console.log(`decrease pending actions current count: ${curPendingActions()}`);
      }
      //if no actions are pending we will parse result and push it to app state
      //otherwise we will discard it
      if (curPendingActions() === 0) {
        getItemsCursor(items => Immutable.fromJS(newData));
      } else {
        console.log(`skip new items because counter is ${curPendingActions()}`);
      }
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
