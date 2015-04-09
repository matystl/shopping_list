import * as actions from './actions';
import {Range, Record} from 'immutable';
import {getRandomString} from '../../lib/getrandomstring';
import {newTodoCursor, todosCursor} from '../state';
import {register} from '../dispatcher';
import {socket} from '../socket';

console.log("Is store created on server?");

// Isomorphic store has to be state-less.

const TodoItem = Record({
  id: '',
  title: ''
});

export const dispatchToken = register(({action, data}) => {

  let todo;

  switch (action) {
    case actions.onNewTodoFieldChange:
      // Always use destructing vars. It's explicit.
      const {name, value} = data;
      newTodoCursor(todo => todo.set(name, value));
      break;

    case actions.addTodo:
      todo = data;
      todosCursor(todos => todos.push(new TodoItem({
        id: getRandomString(),
        title: todo.get('title')
      }).toMap()));
      newTodoCursor(todo => new TodoItem().toMap());
      break;

    case actions.deleteTodo:
      todo = data;
      todosCursor(todos => todos.delete(todos.indexOf(todo)));
      break;

    case actions.clearAll:
      todosCursor(todos => todos.clear());
      break;

    case actions.addHundredTodos:
      todosCursor(todos => {
        return todos.withMutations(list => {
          Range(0, 100).forEach(i => {
            const id = getRandomString();
            list.push(new TodoItem({
              id: id,
              title: `Item #${id}`
            }).toMap());
          });
        });
      });
      break;
  }

});
