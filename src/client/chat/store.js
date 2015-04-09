import * as actions from './actions';
import {Range, Record} from 'immutable';
import {chatCursor, curItems, curFocus,
  curItemsOrder, curPendingActions} from '../state';
import {register} from '../dispatcher';
import {socket} from '../socket';
import Immutable from 'immutable';
import uuid from 'node-uuid';

let debugCounter = 0;

socket.on('new items', function(msg){
    console.log(`new items from server ${JSON.stringify(msg)}`);
    actions.onNewItemsFromServer(msg, false);
});

socket.on('confirm new items', function(msg){
    console.log(`new items from server in socket ${JSON.stringify(msg)}`);
    actions.onNewItemsFromServer(msg, true);
});


export const dispatchToken = register(({action, data}) => {
  switch (action) {

    case actions.onFocus: {
      const id = data;
      curFocus((_) => id);
      break;
    }

    case actions.onMove: {
      const prevItemId = data.id;
      const direction = data.direction;
      const order = curItemsOrder();
      const prevInder = order.indexOf(prevItemId) + direction;
      console.log(`what is my index ${prevInder}`);
      if (prevInder >= 0 && prevInder < order.size) {
        curFocus((_) => order.get(prevInder));
      }
      break;
    };

    case actions.syncStartTodo: {
      console.log(`Will start syncinc todo ${data}`);
      socket.emit(`join room`, data);
      break;
    };

    case actions.syncStopTodo: {
      const x = 8;
      console.log(`Will stop syncinc todo ${data}`);
      socket.emit(`leave room`, data);
      break;
    };



    case actions.onAddItem: {
      const prevItemId = data;
      const clientId = uuid.v4();
      console.log(`new item id ${clientId} and prev item id ${prevItemId}`);
      curItems((items) => items.push(Immutable.fromJS({"id": clientId,"text":"", "checked": true})));
      console.log(`What is curItemsOrder ${curItemsOrder()}`);
      curItemsOrder((order) => {
        const prevIndex = order.indexOf(prevItemId);
        return order.splice(prevIndex + 1,0, clientId);
      });
      console.log(`after change of order`);
      curFocus((_) => clientId);
      debugCounter++;
      console.log(`\t increase counter add items current ${curPendingActions()} debug counter ${debugCounter}`);
      curPendingActions((c) => c+1);
      console.log(JSON.stringify(curItems()));
      socket.emit(`add item`, {id: clientId, afterId: prevItemId, debugCounter: debugCounter});
      break;
    };


    case actions.onEditItemText: {
      const {itemId, value} = data;
      console.log(`item id ${itemId} val ${value}`);
      curItems((items) => items.map((item) => (item.get("id") == itemId)? item.set("text", value): item));
      debugCounter++;
      console.log(`\t increase counter edit items ${curPendingActions()}  debug counter ${debugCounter}`);
      socket.emit(`edit item`, {id: itemId, value: value, debugCounter: debugCounter});
      curPendingActions((c) => c+1);
      break;
    };


    case actions.onNewItemsFromServer: {
      const {msg, decreasePendingActions} = data;
      const {order, items} = msg;
      console.log(`new items from server order:${JSON.stringify(order)} items:${items}`);
      if (decreasePendingActions) {
        console.log(`\t decrease counter ${curPendingActions()}`);
        if (curPendingActions() === 0) console.log(`WTFFFFFFFFFFFFF????????????????? i want to decrease but can't`)
        curPendingActions((c) => (c > 0)? c-1 : 0);
        console.log(`decrease pending actions current count: ${curPendingActions()}`);
      }
      //if no actions are pending we will parse result and push it to app state
      //otherwise we will discard it
      if (curPendingActions() === 0) {
        curItems(_ => Immutable.fromJS(items));
        curItemsOrder(_ => Immutable.fromJS(order));
      } else {
        console.log(`skip new items because counter is ${curPendingActions()}`);
      }
      break;
    };
  };
});
