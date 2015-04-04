import React from 'react';
import {Link} from 'react-router';
import {openTodo, closeTodo, onNewTodoFieldChange, onEditItemText} from './actions';
import {getNewTodo, getItems} from './store_get';



class TodoItem extends React.Component {
  render() {
    const todo = this.props.todo;
    return (
      <li>
        <span>{(todo.get('checked'))? 'X' : 'O'}</span>
        <input
          className="new-todo"
          name="text"
          onChange={(_) => onEditItemText(_, todo.get("id"))}
          value={todo.get('text')}
        />
      </li>
    );
  }
}

class TodoList extends React.Component {
 render() {
   console.log('This is my props');
   console.log(this.props.todos);
   return (
     <ol>
       {this.props.todos.map((todo) => {
         return <TodoItem todo={todo} key={todo.get('id')} />;
       })}
     </ol>
   );
 }

}



export default class Chat extends React.Component {


  componentWillMount() {
    console.log(`WTFFFFFF`);
    console.log(JSON.stringify(getItems()));
    this.chatId = this.context.router.getCurrentParams().id;
    console.log("Test mountu chat "+ this.chatId);
  }

  componentWillUnmount () {
    console.log("Test unmountu chat "+ this.chatId);
  }

  componentWillUpdate(nextProps, nextState) {
    this.chatId = this.context.router.getCurrentParams().id;
  }

  render() {
    return (
      <div>
        <p>
          This is chat subfolder of chat {this.chatId}
          <input
            className="new-todo"
            name="title"
            onChange={onNewTodoFieldChange}
            value={getNewTodo().get('title')}
          />
          <br/>
          Todos:
          <TodoList todos={getItems()} />
          Check <Link to="home">home</Link>.
        </p>
      </div>
    );
  }

  componentDidUpdate(prevProps, prevState) {

  }

}

Chat.contextTypes = {
  router: React.PropTypes.func
}

Chat.willTransitionTo = function (transition, params) {
  console.log(`Will transition to ${params.id}`);
  openTodo(params.id);
}

Chat.willTransitionFrom = function (transition, component) {
  console.log(`Will transition from ${component.chatId}`);
  closeTodo(component.chatId);
}
