import uuid from 'node-uuid';
import {pgQuery, pgTransaction} from '../pgConnect';

export default (req, res) => {
  const newTodoId = uuid.v4();
  const newItemId = uuid.v4();
  console.log(`creating new Todo list ${newTodoId}`);
  pgTransaction((pgQuery) => {
    return pgQuery('INSERT into items (id, todo_id, text, checked) VALUES($1, $2, $3, $4) RETURNING id', [newItemId, newTodoId, '', false])
    .then((result) => {
      console.log('row inserted with id: ' + result.rows[0].id);
      return pgQuery('INSERT into items_order (todo_id, "order") VALUES($1, $2) RETURNING db_id',[newTodoId, [newItemId]]);
    }).then((result) => {
      console.log(`items order created succesfully`);
    });
  }).then((result) => {
    console.log(`resutr result succesfully`);
    res.redirect(`/chat/${newTodoId}`);
  }).catch((e) => {
    res.redirect(`/db_error`);
  });
};
