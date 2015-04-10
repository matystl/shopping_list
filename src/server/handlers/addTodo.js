import {pgTransaction} from '../pgConnect';
import Immutable from 'immutable';

export function addTodo(socket, msg) {
  console.log(`1. want updated item ${JSON.stringify(msg)}`);
  const afterId = msg.afterId;
  const clientId = msg.id;
  const debugId = msg.debugCounter;
  console.log(`1.5 want updated item client Id: ${clientId} afterId: ${afterId}`);
  if (socket.room) {
    pgTransaction((pgQuery) => {
      //we need in multiples items thens
      let resultOrder;
      console.log(`2. i am in room ${socket.room}`);
      return pgQuery('INSERT into items (id, todo_id, text, checked) VALUES($1, $2, $3, $4) RETURNING id', [clientId, socket.room, '', false])
      .then((result) => {
        const resId = result.rows[0].id;
        console.log(`3. after query 1 ${JSON.stringify(result)} with id ${resId}`);
        return pgQuery('SELECT * FROM items_order WHERE todo_id = $1', [socket.room]);
      }).then((result) => {
        console.log(`4.after query for order raw ${JSON.stringify(result)}`);
        const iOrder = Immutable.List(result.rows[0].order);
        console.log(`4.after query for order ${iOrder}`);
        let prevIndex = iOrder.indexOf(afterId);
        if (prevIndex == -1) {
          prevIndex = iOrder.size - 1;
        };
        const iNewOrder =  iOrder.splice(prevIndex + 1,0, clientId);
        console.log(`4.after query new is order ${iNewOrder}`);
        return pgQuery('UPDATE items_order SET "order" = $2 WHERE todo_id = $1;',
                       [socket.room, iNewOrder.toJS()]);
      }).then((result) => {
        console.log(`4.5 writing new order succesfull ${result}`);
        return pgQuery('SELECT * FROM items_order WHERE todo_id = $1', [socket.room]);
      }).then((result) => {
        resultOrder = Immutable.List(result.rows[0].order);
        return pgQuery('SELECT * FROM items WHERE todo_id = $1',
                      [socket.room]);
      }).then((result) => {
        console.log(`5. after query select `);
        const newItems = JSON.parse(JSON.stringify(result.rows));
        const result = {order: resultOrder, items: newItems, debugCounter:debugId};
        return result;
      });
    }).then((result) => {
      socket.broadcast.to(socket.room).emit('new items', result);
      socket.emit('confirm new items', result);
    }).catch((e) => {
      console.log(`errrrrrrrrorrrrrrrrr with ${e}`);
    });
  } else {
    console.log(`1.5 socket is not in room`);
  }
};
