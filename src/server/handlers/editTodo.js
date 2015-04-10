import {pgTransaction} from '../pgConnect';
import Immutable from 'immutable';

export function editTodo(socket, msg) {
  const {id, value} = msg;
  const debugId = msg.debugCounter;
  console.log(`debuj id ${debugId}`);
  console.log(`1. want updated item ${id} ${value} ${JSON.stringify(msg)}`);
  if (socket.room) {
    console.log(`2. i am in room ${socket.room}`);
    pgTransaction((pgQuery) => {
      let newOrder; //here we will store current order of items
      return pgQuery('UPDATE items SET text = $1 WHERE id = $2;', [value, id])
      .then((result) => {
        console.log(`3. after query 1 ${JSON.stringify(result)}`);
        return pgQuery('SELECT * FROM items_order WHERE todo_id = $1', [socket.room]);
      }).then((result) => {
        newOrder = Immutable.List(result.rows[0].order);
        return pgQuery('SELECT * FROM items WHERE todo_id = (SELECT todo_id FROM items WHERE id = $1)', [id]);
      }).then((result) => {
        console.log(`4. after query 1 ${id}`);
        const newItems = JSON.parse(JSON.stringify(result.rows));
        return {test:true, order: newOrder, items: newItems, debugCounter: debugId};
      });
    }).then((result) => {
      socket.broadcast.to(socket.room).emit('new items', result);
      socket.emit('confirm new items', result);
    }).catch((e) => {
      console.log(`errrrrrrrrorrrrrrrrr with  ${err}`);
    });
  } else {
    console.log(`1.5 socket is not in room`);
  }
};
