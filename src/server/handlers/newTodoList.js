import uuid from 'node-uuid';
import pgConnect from '../pgConnect';

export default (req, res) => {
  const newTodoId = uuid.v4();
  console.log(`creating new Todo list ${newTodoId}`);

  pgConnect((err, client, done) => {
    if(err) {
      return console.error('error fetching client from pool', err);
    };
    client.query(
      'INSERT into items (todo_id, text, checked) VALUES($1, $2, $3) RETURNING id',
      [newTodoId, '', false],
      function(err, result) {
        done();
        if (err) {
            console.log(err);
        } else {
            console.log('row inserted with id: ' + result.rows[0].id);
        }
        client.end();
      }
    );
  });


  res.redirect(`/chat/${newTodoId}`);
};
