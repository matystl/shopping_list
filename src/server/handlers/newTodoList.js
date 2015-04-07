import uuid from 'node-uuid';
import pgConnect from '../pgConnect';

export default (req, res) => {
  const newTodoId = uuid.v4();
  const newItemId = uuid.v4();
  console.log(`creating new Todo list ${newTodoId}`);

  pgConnect((err, client, done) => {
    if(err) {
      return console.error('error fetching client from pool', err);
    };
    client.query(
      'INSERT into items (id, todo_id, text, checked) VALUES($1, $2, $3, $4) RETURNING id',
      [newItemId, newTodoId, '', false],
      function(err, result) {
        if (err) {
          console.log(err);
          done();
          client.end();
        } else {
          console.log('row inserted with id: ' + result.rows[0].id);
          client.query(
            'INSERT into items_order (todo_id, "order") VALUES($1, $2) RETURNING db_id',
            [newTodoId, [newItemId]],
            function(err, result) {
              done();
              if (err) {
                console.log(err);
              } else {
                console.log(`items order created succesfully`);
              }
              client.end();
              res.redirect(`/chat/${newTodoId}`);
          });
        }
      }
    );
  });
};
